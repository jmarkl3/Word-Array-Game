export function addAtHead(toAdd, array){
    
    let tempArray = []

    // Add the new thing at the beginning
    tempArray.push(toAdd)

    // Put all of the things from the existing array into the array after
    array.forEach(element => tempArray.push(element))

    return tempArray    
  }