import { randomUUID } from 'crypto';

class Card {
  public id: string;

  public name: string;

  public description: string;

  public createdAt: Date;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  produceCard() {
    return new Card(this.name, this.description);
  }

  setName(newName: string) {
    this.name = newName;
  }

  setDescription(newDescription: string) {
    this.description = newDescription;
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

export { Card };
