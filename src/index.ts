abstract class User {
    firstName: string
    lastName: string
    constructor(firstName: string, lastName: string) {
        this.firstName = firstName
        this.lastName = lastName
    }
    
    abstract getMoney(): number
}

abstract class AbBank {
    name: string
    constructor(name: string) {
        this.name = name
    }
    
    abstract getMoney(): number
}

interface ILender {
    lend(br: IBorrower, amount: number):boolean
    getMoneyBack():boolean
}

interface IBorrower {
    borrow(lender: ILender, amount: number): boolean
    returnMoney(amount: number): boolean
}

class Bank extends AbBank implements ILender {
    money: number;
    borrower?: IBorrower
    lendAmount: number = 0
    constructor(name: string, money: number) {
        super(name)
        this.money = money
    }

    getMoney(): number {
        return this.money
    }

    lend(br: IBorrower, amount: number): boolean {
        if (this.money < amount || this.borrower != null) {
          return false
        } 
        this.lendAmount = amount
        this.borrower = br
        this.money -= amount

        return true
    }

    getMoneyBack():boolean {
        if (this.borrower != null && !this.borrower.returnMoney(this.lendAmount)) {
            return false
        }

        this.money += this.lendAmount
        this.lendAmount = 0
        this.borrower = undefined

        return true
    }
}

class Lender extends User implements ILender {
    money: number;
    borrower?: IBorrower
    lendAmount: number = 0
    constructor(firstName: string, lastName: string, money: number) {
        super(firstName, lastName)
        this.money = money
    }

    getMoney(): number {
        return this.money
    }

    lend(br: IBorrower, amount: number): boolean {
        if (this.money < amount || this.borrower != null) {
          return false
        } 
        this.lendAmount = amount
        this.borrower = br
        this.money -= amount

        return true
    }

    getMoneyBack():boolean {
        if (this.borrower != null && !this.borrower.returnMoney(this.lendAmount)) {
            return false
        }

        this.money += this.lendAmount
        this.lendAmount = 0
        this.borrower = undefined

        return true
    }
}

class Borrower extends User implements IBorrower {
    cash: number;
    lender?: ILender
    constructor(firstName: string, lastName: string, cash: number) {
        super(firstName, lastName)
        this.cash = cash
    }

    getMoney(): number {
        return this.cash
    }

    borrow(lender: ILender, amount: number): boolean { 
        if (this.lender != null || !lender.lend(this, amount)) {
            return false
        }

        this.lender = lender
        this.cash += amount

        return true
    }

    returnMoney(amount: number): boolean {
        if (this.lender == null || this.cash < amount) {
            return false
        }
        this.cash -= amount
        this.lender = undefined
        return true
    }
}

const john = new Lender('John', 'Smith', 1000)
const peter = new Borrower('Peter', 'Parker', 100)
const bank = new Bank('Bank ABC', 5000)

console.log('At the moment, john, peter and bank have money:')
console.log({john: john.getMoney(), peter: peter.getMoney(), bank: bank.getMoney()})
peter.borrow(john, 100)
console.log('And Then, peter borrow john 100:')
console.log({john: john.getMoney(), peter: peter.getMoney(), bank: bank.getMoney()})
john.getMoneyBack()
console.log('And Then, peter repay john 100:')
console.log({john: john.getMoney(), peter: peter.getMoney(), bank: bank.getMoney()})
peter.borrow(bank, 500)
console.log('And Then, peter borrow bank 500:')
console.log({john: john.getMoney(), peter: peter.getMoney(), bank: bank.getMoney()})
bank.getMoneyBack()
console.log('And Then, peter repay bank 500:')
console.log({john: john.getMoney(), peter: peter.getMoney(), bank: bank.getMoney()})
