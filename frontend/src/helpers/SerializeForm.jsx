export const SerializeForm = (form) =>{
    const formData = new FormData(form);

    const completeObject = {};

    for(let [name, value] of formData){
        completeObject[name] = value;
    }

    return completeObject;
}
