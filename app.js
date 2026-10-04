document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open'));
const dateField=document.querySelector('[name="date"]');if(dateField)dateField.min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
const readStore=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
for(const form of document.querySelectorAll('form[data-api]'))form.addEventListener('submit',event=>{
  event.preventDefault();const msg=form.querySelector('.form-message'),btn=form.querySelector('button[type="submit"]'),data=Object.fromEntries(new FormData(form));
  msg.className='form-message';msg.textContent='';form.classList.add('loading');
  try{
    if(form.dataset.api==='/api/signup'){
      const users=readStore('shriSaiClinicUsers'),email=data.email.trim().toLowerCase();
      if(users.some(user=>user.email===email))throw Error('An account with this email already exists in this browser. Please sign in.');
      users.push({name:data.name.trim(),email,phone:data.phone.trim(),password:data.password});localStorage.setItem('shriSaiClinicUsers',JSON.stringify(users));
      msg.textContent='Demo account created in this browser. You can now sign in.';msg.classList.add('show','success');form.reset();setTimeout(()=>location.href='login.html',1200);
    }else if(form.dataset.api==='/api/login'){
      const email=data.email.trim().toLowerCase(),user=readStore('shriSaiClinicUsers').find(item=>item.email===email&&item.password===data.password);
      if(!user)throw Error('Email or password is incorrect. Create a demo account first if you are new.');
      localStorage.setItem('shriSaiClinicCurrentUser',JSON.stringify({name:user.name,email:user.email}));msg.textContent='Welcome back, '+user.name+'.';msg.classList.add('show','success');setTimeout(()=>location.href='index.html',900);
    }else if(form.dataset.api==='/api/appointments'){
      const visits=readStore('shriSaiClinicAppointments');visits.push({...data,createdAt:new Date().toISOString(),status:'Demo request'});localStorage.setItem('shriSaiClinicAppointments',JSON.stringify(visits));
      msg.textContent='Demo request saved in this browser only. The clinic has not been notified; call 88888 88575 to arrange a real visit.';msg.classList.add('show','success');form.reset();if(dateField)dateField.min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
    }
  }catch(error){msg.textContent=error.message;msg.classList.add('show','error')}
  finally{form.classList.remove('loading');btn.innerHTML=btn.dataset.original||btn.innerHTML}
});
