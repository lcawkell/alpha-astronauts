export interface Astronaut {
    name: string;
    description: string;
    image: string;
    dna: string;
    edition: number;
    date: number;
    attributes: Attribute[];
    stakedOnBlock?: number;
    claimedOnBlock?: number;
}
interface Attribute {
    trait_type: string;
    value: string;
}
export {};
