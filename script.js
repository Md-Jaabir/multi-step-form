let steps=document.querySelectorAll(".step");
let menuItems=document.querySelectorAll('.form .sidebar .menu-item');
let topBarItems=document.querySelectorAll(".top-bar .round-button");
let planOptions=document.querySelectorAll(".step-2 .options .option");
let switchElement=document.querySelector(".step-2 .billing-duration .switch");
let addOnOptions=document.querySelectorAll(".step-3 .add-ons .add-on");
let nameInput=document.querySelector("#name");
let emailInput=document.querySelector("#email");
let phoneInput=document.querySelector("#phone");
let bottomBar=document.querySelector(".bottom-bar.mobile");
let currentStep=0;
let spaces=[50,190,100,0,0]

let info={
    name:"",
    email:"",
    phone:"",
    plan:0,
    addOns:[0,1],
    duration:"monthly"
}

let plans=[
    {name:"Arcade",price:{monthly:9,yearly:90}},
    {name:"Advanced",price:{monthly:12,yearly:120}},
    {name:"Pro",price:{monthly:15,yearly:150}}
]

let addOns=[
    {name:"Online Service",price:{monthly:1,yearly:10}},
    {name:"Larger Storage",price:{monthly:2,yearly:20}},
    {name:"Customizable Profile",price:{monthly:2,yearly:20}}
]

window.onload=()=>{
    updatePlans();
    updateAddOns();
    setSummary();
    setBottomBar();
}

window.onresize=()=>{
    if(innerWidth>=1000){
        bottomBar.style.display="none";
    }else{
        bottomBar.style.display="flex";
    }
}

function switchStep(stepNo){
    currentStep=stepNo;
    steps.forEach(step=>{
        step.classList.remove("active");
    });
    menuItems.forEach(menuItem=>{
        menuItem.childNodes[0].classList.remove("active");
    });

    topBarItems.forEach(menuItem=>{
        menuItem.classList.remove("active");
    });

    steps[stepNo].classList.add("active");
    currentStep!==4 && menuItems[stepNo].childNodes[0].classList.add("active");
    currentStep!==4 && topBarItems[stepNo].classList.add("active");
    document.querySelector(".space").style.height=spaces[currentStep]+"px";
    setBottomBar();
    setSummary();
}

function selectPlan(planIndex){
    planOptions.forEach(option=>{
        option.classList.remove("active");
    });

    planOptions[planIndex].classList.add("active");
    info.plan=planIndex;
}

function handleAddOn(addOnIndex){
    if(addOnOptions[addOnIndex].classList.contains("active")){
        unCheckAddOn(addOnIndex);
    }else{
        checkAddOn(addOnIndex);
    }
}

function checkAddOn(index){
    addOnOptions[index].classList.add("active");
    info.addOns.push(index);
    info.addOns.sort((a,b)=>a-b);
}

function unCheckAddOn(index){
    addOnOptions[index].classList.remove("active");
    info.addOns.splice(info.addOns.indexOf(index),1);
    info.addOns.sort((a,b)=>a-b);
}

switchElement.addEventListener("click",handleSwitch);

function handleSwitch(){
    if(switchElement.classList.contains("monthly")){
        switchElement.classList.remove("monthly");
        document.querySelector(`.step-2 .billing-duration span.monthly`).classList.remove("active");
        info.duration="yearly"
    }else{
        switchElement.classList.remove("yearly");
        document.querySelector(`.step-2 .billing-duration span.yearly`).classList.remove("active");
        info.duration="monthly";
    }
    switchElement.classList.add(info.duration);
    document.querySelector(`.step-2 .billing-duration span.${info.duration}`).classList.add("active");
    updatePlans();
    updateAddOns();
}

function updatePlans(){
    if(info.duration==="monthly"){
        document.querySelectorAll(".step-2 .options .option p:last-child").forEach(element=>{
            element.style.opacity="0";
            element.style.height="0";
        });
        plans.forEach(plan=>{
            document.querySelector(`.step-2 .options #${plan.name.toLocaleLowerCase()} .desc .price`).innerHTML=`$${plan.price.monthly}/mo`
        });
    }else{
        document.querySelectorAll(".step-2 .options .option p:last-child").forEach(element=>{
            element.style.opacity="1";
            element.style.height="auto";
        });
        plans.forEach(plan=>{
            document.querySelector(`.step-2 .options #${plan.name.toLocaleLowerCase()} .desc .price`).innerHTML=`$${plan.price.yearly}/yr`
        });
    }
}

function updateAddOns(){
    if(info.duration==="monthly"){
        addOns.forEach(addOn=>{
            document.querySelector(`.step-3 .add-ons .add-on#${addOn.name.toLowerCase().replaceAll(" ","-")} .price`).innerHTML=`$${addOn.price.monthly}/mo`;
        });
    }else{
        addOns.forEach(addOn=>{
            document.querySelector(`.step-3 .add-ons .add-on#${addOn.name.toLowerCase().replaceAll(" ","-")} .price`).innerHTML=`$${addOn.price.yearly}/yr`;
        });
    }
}

function handleInputChange(element){
    info[element.id]=element.value;
}

function showInputError(id){
    document.getElementById(id).parentNode.classList.add("error");
}

function hideInputError(id){
    document.getElementById(id).parentNode.classList.remove("error");
}

function checkInputErrors(){
    let name=nameInput.value;
    let email=emailInput.value;
    let phone=phoneInput.value;
    let emailErrorBox=document.querySelector(".step-1 .inputs .input.email .label .error");
    let nameErrorBox=document.querySelector(".step-1 .inputs .input.name .label .error");
    let phoneErrorBox=document.querySelector(".step-1 .inputs .input.phone .label .error");

    let emailRegex=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let phoneRegex=/(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g;
    let errors=0;
    hideInputError("name");
    hideInputError("email");
    hideInputError("phone");
    if(!name){
        nameErrorBox.innerHTML="This field is required";
        showInputError("name");
        switchStep(0);
        errors++;
    }else if(name.length<3){
        nameErrorBox.innerHTML="Name must be long enough";
        showInputError("name");
        errors++;
    }

    if(!email){
        emailErrorBox.innerHTML="This field is required";
        showInputError("email");
        errors++;
    }else if(!email.match(emailRegex)){
        emailErrorBox.innerHTML="Email must be correct";
        showInputError("email");
        errors++;
    }

    if(!phone){
        phoneErrorBox.innerHTML="This field is required";
        showInputError("phone");
        errors++;
    }else if(!phone.match(phoneRegex)){
        phoneErrorBox.innerHTML="Phone number must be valid";
        showInputError("phone");
        errors++;
    }

    
    return errors;
}

function upper(string){
    return string.substring(0,1).toUpperCase()+string.substring(1,string.length);
}

function calculateTotalPrice(){
    let totalPrice=plans[info.plan].price[info.duration];
    info.addOns.forEach(addOnIndex=>{
        let addOn=addOns[addOnIndex];
        totalPrice+=addOn.price[info.duration];
    });
    return totalPrice;
}

function setSummary(){
    document.querySelector(".step-4 .plans .plan .title h3").innerHTML=`${upper(plans[info.plan].name)}(${upper(info.duration)})`;
    document.querySelector(".step-4 .plans .plan .price").innerHTML=`$${plans[info.plan].price[info.duration]}/${info.duration==="monthly"?"mo":"yr"}`;
    document.querySelector(".step-4 .plans .add-on-list").innerHTML=info.addOns.map(addOnIndex=>{
        let addOn=addOns[addOnIndex];
        return `<div class="add-on-item">
                    <p class="title">${addOn.name}</p>
                    <p class="price">+${addOn.price[info.duration]}/${info.duration==="monthly"?"mo":"yr"}</p>
                </div>`;
    }).join("");
    document.querySelector(".step-4 .total .title").innerHTML=`Total(per ${info.duration==="monthly"?"month":"year"})`;
    document.querySelector(".step-4 .total .total-price").innerHTML=`+$${calculateTotalPrice()}/${info.duration==="monthly"?"mo":"yr"}`;
}

function nextStep(){
    currentStep<4 && switchStep(currentStep+1);
}

function goBack(){
    currentStep>0 && switchStep(currentStep-1);
}

function nextAtFirstStep(){
    let errors=checkInputErrors();
    if(errors===0){
        nextStep();
    }
}

function confirm(){
    let errors=checkInputErrors();
    if(errors===0){
        nextStep();
        console.table(info);
    }else{
        switchStep(0);
    }
}

function setBottomBar(){
    if(currentStep===0){
        bottomBar.style.display="flex";
        bottomBar.innerHTML=`<button class="back-button" style="visibility:hidden">Go back</button>
        <button class="next-button" onclick="nextAtFirstStep()">Next Step</button>`;
    }else if(currentStep===3){
        bottomBar.style.display="flex";
        bottomBar.innerHTML=`<button class="back-button" onclick="goBack()">Go back</button>
        <button class="next-button confirm" onclick="confirm()">Confirm</button>`;
    }else if(currentStep===4){
        bottomBar.style.display="none";
    }else{
        bottomBar.style.display="flex";
        bottomBar.innerHTML=`<button class="back-button" onclick="goBack()">Go back</button>
        <button class="next-button" onclick="nextStep()">Next Step</button>`;
    }
}