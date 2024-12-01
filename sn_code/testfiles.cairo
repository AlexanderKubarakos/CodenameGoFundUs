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
    const ETH_CONTRACT_ADDRESS: felt252 =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;

    #[storage]
    struct Storage {
        // Store the last user who interacted with the contract
        last_user: ContractAddress,
        // Track number of interactions per user
        user_interactions: LegacyMap::<ContractAddress, u256>,
        funds: Map<u32, Fund>,
        fundsId: u32,
        userId: u32,
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
    struct Fund {
        name: felt252,
        owner: ContractAddress,
        amount: u256,
        num_members: u256,
        request_percent: u256,
        members: Vec<ContractAddress>,
        withdrawal_requests: Vec<u256>,
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
    fn interact(ref self: ContractState) {
        // Retrieve the caller's wallet address
        let user_wallet = get_caller_address();

        // Update last user
        self.last_user.write(user_wallet);

        // Increment user's interaction count
        let current_interactions = self.user_interactions.read(user_wallet);
        let new_interaction_count = current_interactions + 1;
        self.user_interactions.write(user_wallet, new_interaction_count);

        // Emit an event with user interaction details
        self.emit(Event::UserInteraction(UserInteraction {
            user: user_wallet,
            interaction_count: new_interaction_count,
        }));
    }

    #[external(v0)]
    fn createFund(ref self: ContractState, name: felt252, request_percent: u256) -> u32 {
        let members: Array<ContractAddress> = array![];
        let withdrawal_requests: Array<u256> = array![];
        let mut fundsId = self.fundsId.read(); 
        let newId = fundsId + 1;

        let mut newFund = self.funds.entry(newId);
        newFund.name.write(name);
        newFund.owner.write(get_caller_address());
        newFund.amount.write(1);
        newFund.num_members.write(1);
        newFund.request_percent.write(request_percent);
               
        self.fundsId.write(newId);

        newId
    }
    #[external(v0)] 
    fn setFundName(ref self: ContractState, entry: u32, name: felt252) -> felt252 {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.name.write(name);
        returnfunds.name.read()

    }
    #[external(v0)] 
    fn setFundOwner(ref self: ContractState, entry: u32, owner: ContractAddress) -> ContractAddress {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.owner.write(owner);
        returnfunds.owner.read()

    }
    #[external(v0)] 
    fn setFundAmount(ref self: ContractState, entry: u32, amount: u256) -> u256 {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.amount.write(amount);
        returnfunds.amount.read()
    }
    #[external(v0)] 
    fn setFundPercent(ref self: ContractState, entry: u32, request: u256) -> u256 {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.request_percent.write(request);
        returnfunds.request_percent.read()
    }


    #[external(v0)] 
    fn getFundName(self: @ContractState, entry: u32) -> felt252 {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.name.read()
    }
    #[external(v0)] 
    fn getFundOwner(self: @ContractState, entry: u32) -> ContractAddress {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.owner.read()
    }
    #[external(v0)] 
    fn getFundAmount(self: @ContractState, entry: u32) -> u256 {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.amount.read()
    }
    #[external(v0)] 
    fn getFundPercent(self: @ContractState, entry: u32) -> u256 {
        let mut returnfunds = self.funds.entry(entry);
        returnfunds.request_percent.read()
    }
    #[external(v0)] 
    fn get_last_user(self: @ContractState) -> ContractAddress {
        self.last_user.read()
    }

    #[external(v0)] 
    fn get_user_interaction_count(
        self: @ContractState, 
        user: ContractAddress
    ) -> u256 {
        self.user_interactions.read(user)
    }
    #[abi(embed_v0)]
    impl YourContractImpl of IYourContract<ContractState> {

        fn pay(ref self: ContractState, eth_amount: u256) {
                // In `Debug Contract` or UI implementation call `approve` on ETH contract before
                // invoke fn set_greeting()
                let contract_address = contract_address_const::<ETH_CONTRACT_ADDRESS>();
                let dispatcher = IERC20Dispatcher { contract_address: contract_address };
                dispatcher
                    .transfer_from(get_caller_address(), get_contract_address(), eth_amount);

          
        }
       
    }
} 