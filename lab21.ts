import * as fs from 'fs';
import * as readline from 'readline';


interface Building {
    id: string;
    price: number;
}


class Conjunto {
    address: string;
    price: number;
    contactPhone: number;
    id: string;

    constructor(data: any) {
        this.address = data.address;
        this.price = data.price;
        this.contactPhone = data.contactPhone;
        this.id = data.id;
    }
}
class House extends Conjunto{
    zoneDangerus: string;
    constructor(data: any){
        super(data);
        this.zoneDangerus = data.zoneDangerus;

    }
}

class Apartments extends Conjunto{
    isPetFriendly: boolean;

    constructor(data: any){
        super(data);
        this.isPetFriendly = data.isPetFriendly;
        
    }
}

class Premises extends Conjunto{
    commercialActivities: string[];

    constructor(data: any){
        super(data);
        this.commercialActivities = data.commercialActivities;
    }


    
}


function filterHouses(houses: House[], clientRequirements: any): Building[]{

    const filteredBuildings: Building[] = [];

    const base: any = [];
    houses.forEach((house: {address: string, price: number, contactPhone: number,  zoneDangerus: string, id: string})=>{
        let newhouses = new House(house);
        if(clientRequirements.minDanger === "Red"){
            if(newhouses.zoneDangerus === clientRequirements.minDanger){
                if(newhouses.price <= clientRequirements.budget){
                    base.push(newhouses);
                }
            }
        }else if(clientRequirements.minDanger === "Orange"){
            if(newhouses.zoneDangerus !== "Yellow" && newhouses.zoneDangerus !== "Green"){
                if(newhouses.price <= clientRequirements.budget){
                    base.push(newhouses);
                }
            }
        }else if(clientRequirements.minDanger === "Yellow"){
            if(newhouses.zoneDangerus !== "Green"){
                if(newhouses.price <= clientRequirements.budget){
                    base.push(newhouses);
                }
            }
        }else{
            if(newhouses.price <= clientRequirements.budget){
                base.push(newhouses);
            }
        }
        
    })

    base.forEach((a: {id: string, price: number})=>{
        let final: Building = {
            id: a.id,
            price: a.price
        };

        filteredBuildings.push(final);
    })

    console.log(filteredBuildings)
    
    return filteredBuildings ;
}

function filterApartments(apartments: Apartments[], clientRequirements: any): Building[]{
    const filteredBuildings: Building[] = [];
    const base: any = [];
    apartments.forEach((apartment: {address: string, price: number, contactPhone: number,  isPetFriendly: boolean, id: string})=>{
        let newapartment = new Apartments(apartment);
        if(newapartment.isPetFriendly === clientRequirements.wannaPetFriendly){
            if(newapartment.price <= clientRequirements.budget){
                base.push(newapartment);
            }
        }
    })


    base.forEach((a: {id: string, price: number})=>{
        let final: Building = {
            id: a.id,
            price: a.price
        };

        filteredBuildings.push(final);
    })
    
    return filteredBuildings ;

    
}

function filterPremises(premises: Premises[], clientRequirements: any): Building[]{
    const filteredBuildings: Building[] = [];
    const base: any = [];
    premises.forEach((premise: {address: string, price: number, contactPhone: number,  commercialActivities: string[], id: string})=>{
        let newpremises = new Premises(premise);
        newpremises.commercialActivities.forEach((clave: any) =>{
            if(clave === clientRequirements.commercialActivity){
                if(newpremises.price <= clientRequirements.budget)
                base.push(newpremises);
            }
        })
    })

    base.forEach((a: {id: string, price: number})=>{
        let final: Building = {
            id: a.id,
            price: a.price
        };

        filteredBuildings.push(final);
    })
    

    return filteredBuildings;

    
}



function recommendBuildings(input1: any, input2: any): string[] {
    let recommendedBuildings: Building[] = [];
    const clientRequirements = input2;
    if (clientRequirements.typeBuilder === "Houses") {

        input1.forEach((obj:{services: any, builds: any}) => {
            if (clientRequirements.typeBuilder === "Houses" && obj.builds && obj.builds.Houses) {
                recommendedBuildings = filterHouses(obj.builds.Houses, clientRequirements);
            }
        })


     
    } else if (clientRequirements.typeBuilder === "Apartments") {

        input1.forEach((obj:{services: any, builds: any}) => {
            if (clientRequirements.typeBuilder === "Apartments" && obj.builds && obj.builds.Apartments) {
                recommendedBuildings = filterApartments(obj.builds.Apartments, clientRequirements);
            }
        })
       
    } else if (clientRequirements.typeBuilder === "Premises") {

        input1.forEach((obj:{services: any, builds: any}) => {
            if (clientRequirements.typeBuilder === "Premises" && obj.builds && obj.builds.Premises) {
                recommendedBuildings = filterPremises(obj.builds.Premises, clientRequirements);
            }
        })
       
    }

    recommendedBuildings.sort((a, b) => a.price - b.price);

    const recommendedIds = recommendedBuildings.map(building => building.id);

    return recommendedIds;
}


const readJson = (file: string) =>{
    let readed = fs.readFileSync(file, 'utf-8');
    let lines = readed.trim().split('\n'); 
    return lines.map(line => JSON.parse(line));
}

const data = readJson("./input_lab_2_example.jsonl");

data.forEach(input =>{
    let input1 = input.input1;
    let input2 = input.input2;
    let result = recommendBuildings(input1, input2);
    console.log(result);
})

