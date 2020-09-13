import assert from 'assert';
import numeral from 'numeral'

export default class Money{
    private cents = 0;

    private constructor(cents: number){
        assert(cents%1 === 0);
        this.cents = cents;
    }
    public static fromCents(cents: number): Money {
        return new Money(cents);
    }

    public static fromNumber(moneyNumber: number): Money{
        const cents = Math.round(moneyNumber*100);
        return new Money(cents);
    }

    public static fromString(moneyString: string): Money{
        return this.fromNumber(Number(moneyString));
    }

    public toString(): string{
        return numeral(this.cents/100).format('0,0.00')
    }
    public toNumber(): number{
        return this.cents/100;
    }

    public increase(money: Money): Money{
        this.cents += money.cents;
        return this;
    }

    public decrease(money: Money): Money{
        this.cents -= money.cents;
        return this;
    }

    public plus(money: Money): Money{
        return new Money(this.cents + money.cents);
    }

    public minus(money: Money): Money{
        return new Money(this.cents - money.cents);
    }

    public neg(): Money{
        this.cents = -this.cents;
        return this;
    }

    public equals(money: Money): boolean{
        return money.cents === this.cents;
    }

    public greaterThan(money: Money): boolean{
        return this.cents > money.cents;
    }

    public static ZERO(): Money{
        return new Money(0);
    }
    
}