function select(memory){
    // Write your code here
    // memory = ', '+memory
    let names = memory.split(', ')
    let final = []
    for(let x=0;x<names.length;x++){
        let name = names[x]
        if(names.substring(0,1)==='!'){
            x=x+1;
        }else{
            final.push(name)
        }
    }
    return final.join(', ')
}
}
console.log(select('!Partha Ashanti, !Mindaugas Burton, Stacy Thompson, Amor Hadrien, !Ahtahkakoop Sothy, Partha Ashanti, Uzi Griffin, Partha Ashanti, !Serhan Eutimio, Amor Hadrien, Noor Konstantin'))