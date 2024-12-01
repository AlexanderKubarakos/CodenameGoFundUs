#[starknet::interface]
pub trait IYourContract<TContractState> {
    fn pay(ref self: TContractState, eth_amount: u256);

}


#[starknet::contract]
mod WalletInteraction {
    use core::starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,Vec, VecTrait, MutableVecTrait
    };
    use starknet::ContractAddress;
    use starknet::contract_address_const;
    use core::starknet::{get_caller_address, get_contract_address};
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::{IYourContract};
    const STARK: felt252 = 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;
   

    #[storage]
    struct Storage {
        funds: Map::<ContractAddress, Fund>,
        users: Map::<ContractAddress, User>,
        token: IERC20Dispatcher,
    }
    #[constructor]
    fn constructor(ref self: ContractState) 
    {
    let owner: ContractAddress = contract_address_const::<0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d>();
    let dispatcher = IERC20Dispatcher { contract_address: owner };
    self.token.write(dispatcher);
    }


    #[starknet::storage_node]
    struct Request {
        amount: u256,
        yes: u256,
        no: u256
    }

    #[starknet::storage_node]
    struct User {
        name: felt252,
        founded_funds: Vec<u256>,
        joined_funds: Vec<ContractAddress>,
    }

    #[starknet::storage_node]
    struct Fund{
        name: felt252,
        amount: u256,
        total: u256,
        request_percent: u256,
        withdrawal_requests: Request,
        active_request: bool,
    }
    
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserInteraction: UserInteraction,
    }

    #[derive(Drop, starknet::Event)]
    struct UserInteraction {
        user: ContractAddress,
        interaction_count: u256,
    }


    #[external(v0)] 
    fn getRequest(self: @ContractState, fund: ContractAddress) -> u256 {
        let fund = self.funds.entry(fund);
        return fund.withdrawal_requests.amount.read();
    }

    #[external(v0)] 
    fn getRequestYes(self: @ContractState, fund: ContractAddress) -> u256 {
        let fund = self.funds.entry(fund);
        return fund.withdrawal_requests.yes.read();
    }
    #[external(v0)] 
    fn getRequestNo(self: @ContractState, fund: ContractAddress) -> u256 {
        let fund = self.funds.entry(fund);
        return fund.withdrawal_requests.no.read();
    }

    #[external(v0)] 
    fn totalFundMembers(self: @ContractState, fund: ContractAddress) -> u256 {
        let fund = self.funds.entry(fund);
        return fund.total.read();
    }








    //createUser
    #[external(v0)]
    fn createUser(ref self: ContractState, name: felt252, user: ContractAddress){
        let mut newUser = self.users.entry(user);
        newUser.name.write(name);
    }

    //user join fund
    #[external(v0)]
    fn joinFund(ref self: ContractState, user_id: ContractAddress, fund_id: ContractAddress){
        let mut user = self.users.entry(user_id);
        let mut fund = self.funds.entry(fund_id);

        user.joined_funds.append().write(fund_id);


        let new_total = fund.total.read() + 1;
        fund.total.write(new_total);

    }
    
    

    //createRequest
    #[external(v0)]
    fn create_request(ref self: ContractState, fund: ContractAddress, amount: u256){
        let mut request_to_this_fund = self.funds.entry(fund);
        request_to_this_fund.withdrawal_requests.amount.write(amount);
        request_to_this_fund.withdrawal_requests.yes.write(0);
        request_to_this_fund.withdrawal_requests.no.write(0);
        request_to_this_fund.active_request.write(true);
    }
    //vote
    #[external(v0)]
    fn vote(ref self: ContractState, fund: ContractAddress, state: bool) -> bool{
        let mut vote_to_this_fund = self.funds.entry(fund);
        if state == false{ 
            vote_to_this_fund.withdrawal_requests.no.write(vote_to_this_fund.withdrawal_requests.no.read() + 1);
            false
        }else{
            vote_to_this_fund.withdrawal_requests.yes.write(vote_to_this_fund.withdrawal_requests.yes.read() + 1);
            let yes_votes = vote_to_this_fund.withdrawal_requests.yes.read();
            let acceptance_votes = vote_to_this_fund.request_percent.read() / 100 * vote_to_this_fund.total.read();

            if yes_votes >= acceptance_votes {
                let address = contract_address_const::<STARK>();
                let dispatcher = IERC20Dispatcher { contract_address: address };
                let response = dispatcher.transfer_from(get_contract_address(), fund, vote_to_this_fund.withdrawal_requests.amount.read());
            
                //reset to blank
                vote_to_this_fund.withdrawal_requests.amount.write(0);
                vote_to_this_fund.withdrawal_requests.yes.write(0);
                vote_to_this_fund.withdrawal_requests.no.write(0);

                true
            }else{
                false
            }
        }
    }

    #[external(v0)]
    fn createFund(ref self: ContractState, address: ContractAddress, name: felt252, request_percent: u256){
        let mut newFund = self.funds.entry(address);
        newFund.name.write(name);
        newFund.amount.write(0);
        newFund.total.write(0);
        newFund.request_percent.write(request_percent);
        newFund.active_request.write(false);
    
        //write withdrawal request
        newFund.withdrawal_requests.amount.write(0);
        newFund.withdrawal_requests.yes.write(0);
        newFund.withdrawal_requests.no.write(0);
    
    }

    #[external(v0)] 
    fn setFundName(ref self: ContractState, wallet: ContractAddress, name: felt252) -> felt252 {
        let mut returnfunds = self.funds.entry(wallet);
        returnfunds.name.write(name);
        returnfunds.name.read()

    }
    #[external(v0)] 
    fn setFundAmount(ref self: ContractState, wallet: ContractAddress, amount: u256) -> u256 {
        let mut returnfunds = self.funds.entry(wallet);
        returnfunds.amount.write(amount);
        returnfunds.amount.read()
    }
    #[external(v0)] 
    fn setFundPercent(ref self: ContractState, wallet: ContractAddress, request: u256) -> u256 {
        let mut returnfunds = self.funds.entry(wallet);
        returnfunds.request_percent.write(request);
        returnfunds.request_percent.read()
    }


    #[external(v0)] 
    fn getFundName(self: @ContractState, wallet: ContractAddress) -> felt252 {
        let mut returnfunds = self.funds.entry(wallet);
        returnfunds.name.read()
    }
    #[external(v0)] 
    fn getFundAmount(self: @ContractState, wallet: ContractAddress) -> u256 {
        let mut returnfunds = self.funds.entry(wallet);
        returnfunds.amount.read()
    }
    #[external(v0)] 
    fn getFundPercent(self: @ContractState, wallet: ContractAddress) -> u256 {
        let mut returnfunds = self.funds.entry(wallet);
        returnfunds.request_percent.read()
    }


    #[external(v0)] 
    fn pay(ref self: ContractState, recipient: ContractAddress, sender: ContractAddress, amount: u256) -> bool {

                let address = contract_address_const::<STARK>();
                let dispatcher = IERC20Dispatcher { contract_address: address };
                let response = dispatcher
                    .transfer_from(sender, recipient, amount);
                response
    }
    
    #[external(v0)] 
    fn balance(self: @ContractState, wallet: ContractAddress)  -> u256 {

                    let address = contract_address_const::<STARK>();
                    let dispatcher = IERC20Dispatcher { contract_address: address };
                    let balance = dispatcher.balance_of(wallet);
                    balance
            }
       
    
} 