function select(memory){
    // Write your code here
    // memory = ', '+memory
    let names = memory.split(', ')
    let final = []
    for(let x=0;x<names.length-1;x++){
        let name = names[x]
        if(name.substring(0,1)==='!' && names[x+1].substring(0,1)==='!'){
            continue;
        }else if(name.substring(0,1)==='!'){
            x=x+1
        }else{
            final.push(name)
        }
    }
    return final.join(', ')
}

console.log(select('!Eleena Daru, Obi-Wan Kenobi, Eleena Daru, Jar-Jar Binks'))