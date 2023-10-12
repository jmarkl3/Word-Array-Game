export function addAtHead(toAdd, array){
    
    let tempArray = []

    // Add the new thing at the beginning
    tempArray.push(toAdd)

    // Put all of the things from the existing array into the array after
    array.forEach(element => tempArray.push(element))

    return tempArray    
  }

  export function dateString(date, dateOnly){
    if(typeof date !== "object") return "Not A date"
    if(!date)
      date = new Date()

    if(dateOnly)
      return date.getFullYear() + "-" + 
        (date.getMonth() + 1).toString().padStart(2, "0") + 
        "-" + date.getDate().toString().padStart(2, "0")  
    else
      return date.getFullYear() + "-" + 
        (date.getMonth() + 1).toString().padStart(2, "0") + 
        "-" + date.getDate().toString().padStart(2, "0") + 
        "T" + date.getHours().toString().padStart(2, "0") + ":" + 
        date.getMinutes().toString().padStart(2, "0") + ":" + 
        date.getSeconds().toString().padStart(2, "0")  
  }