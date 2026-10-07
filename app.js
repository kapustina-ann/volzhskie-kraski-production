'use strict';
const applications=[
 {name:'Ворота и металлоконструкции',title:'Цвет для вашей серии изделий',text:'Для ворот, ограждений и металлических конструкций. Согласуем цвет по образцу и требования к покрытию для вашей технологии окраски.',hint:'Металл и его подготовка, уличная или внутренняя эксплуатация, способ нанесения, цвет и объём партии.'},
 {name:'Стеллажи и складское оборудование',title:'Покрытие для серийных конструкций',text:'Для производства и обновления стеллажей, рам и другого складского оборудования. Обсудим материал и воспроизведение цвета при повторных поставках.',hint:'Назначение конструкции, поверхность, требования к внешнему виду, технология нанесения и планируемый расход.'},
 {name:'Погрузчики и складская техника',title:'Материал для обновления техники',text:'Рассмотрим задачу ремонтной окраски погрузчиков и складской техники. Подберём материал с учётом существующего покрытия и условий работы.',hint:'Тип техники, состояние старого покрытия, подготовка поверхности, цвет и требуемый объём.'},
 {name:'Станки и промышленное оборудование',title:'Цвет для восстановленного оборудования',text:'Для ремонтной окраски станков и промышленного оборудования. Уточним требования к покрытию и условия, в которых оно будет работать.',hint:'Тип оборудования, воздействующие среды, подготовка поверхности, способ нанесения и сроки ремонта.'},
 {name:'Спецтехника и коммерческий транспорт',title:'Покрытие под вашу ремонтную задачу',text:'Для согласованных задач окраски спецтехники, сельскохозяйственной техники и коммерческого транспорта. Применимость материала проверяем для конкретного узла и условий эксплуатации.',hint:'Вид техники и окрашиваемые детали, требования к покрытию, цветовой образец и объём заказа.'},
 {name:'Ремонт железнодорожного транспорта',title:'Рассмотрим требования к ремонту',text:'Обсудим материалы для отдельных ремонтных работ. Возможность применения зависит от требований к конкретному объекту, допускам и сертификации.',hint:'Назначение материала, объект ремонта, нормативные требования, необходимые допуски и техническое задание.'}
];
const task=document.getElementById('task');const intent=document.getElementById('intent');
function addContext(text){document.getElementById('letter-result').hidden=true;if(!task.value.includes(text))task.value=(task.value.trim()?task.value.trim()+'\n':'')+text;}
document.querySelectorAll('[data-application-request]').forEach(link=>link.addEventListener('click',()=>addContext('Применение: '+applications[Number(link.dataset.applicationRequest)].name+'.')));
document.querySelectorAll('[data-intent]').forEach(link=>link.addEventListener('click',()=>{intent.value=link.dataset.intent;document.getElementById('letter-result').hidden=true;if(link.dataset.material)addContext('Материал: '+link.dataset.material+'.');}));
let preparedLetter='';
document.getElementById('request-form').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const d=new FormData(form);const clean=key=>String(d.get(key)||'').trim();
 if(!clean('company')||!clean('name')||!clean('task')){const input=!clean('company')?form.elements.company:!clean('name')?form.elements.name:form.elements.task;input.setCustomValidity('Пожалуйста, заполните поле.');input.reportValidity();input.addEventListener('input',()=>input.setCustomValidity(''),{once:true});return;}
 preparedLetter=['Здравствуйте!','', 'Цель обращения: '+clean('intent'),'Компания: '+clean('company'),'Контактное лицо: '+clean('name'),'Email: '+clean('email'),'Телефон: '+(clean('phone')||'не указан'),'Объём: '+(clean('volume')||'нужно уточнить'),'','Задача:',clean('task'),'','Прошу обсудить возможность изготовления, стоимость и сроки.'].join('\n');
 const subject='Запрос: '+clean('intent')+' — '+clean('company');
 document.getElementById('mail-link').href='mailto:sales@volgakraski.ru?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(preparedLetter);
 document.getElementById('letter-text').textContent=preparedLetter;document.getElementById('letter-result').hidden=false;document.getElementById('copy-status').textContent='';document.getElementById('letter-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
});
document.getElementById('copy-request').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText(preparedLetter);status.textContent='Текст скопирован. Вставьте его в письмо на sales@volgakraski.ru.';}catch{document.querySelector('#letter-result details').open=true;status.textContent='Не удалось скопировать автоматически. Выделите текст запроса ниже и скопируйте его вручную.';}});
document.getElementById('request-form').addEventListener('input',()=>{document.getElementById('letter-result').hidden=true;});

const tzDialog=document.getElementById('tz-dialog');
const tzForm=document.getElementById('tz-form');
const tzResult=document.getElementById('tz-result');
let tzTrigger=null, tzLetter='';
document.querySelectorAll('[data-open-tz]').forEach(button=>button.addEventListener('click',()=>{tzTrigger=button;tzDialog.showModal();document.body.classList.add('tz-open');}));
tzDialog.querySelector('.tz-close').addEventListener('click',()=>tzDialog.close());
tzDialog.addEventListener('click',event=>{if(event.target!==tzDialog)return;const r=tzDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)tzDialog.close();});
tzDialog.addEventListener('close',()=>{document.body.classList.remove('tz-open');if(tzTrigger)tzTrigger.focus();});
function validateTzContact(){const f=tzForm.elements;f.phone.setCustomValidity(f.phone.value.trim()||f.email.value.trim()?'':'Укажите телефон или email.');}
tzForm.addEventListener('input',()=>{tzResult.hidden=true;tzForm.querySelectorAll('input,textarea').forEach(el=>el.setCustomValidity(''));validateTzContact();});
tzForm.addEventListener('submit',event=>{event.preventDefault();validateTzContact();const f=tzForm.elements;for(const key of ['subject','contact','specification']){f[key].setCustomValidity(f[key].value.trim()?'':'Пожалуйста, заполните поле.');}if(!tzForm.reportValidity())return;
tzLetter=['Здравствуйте!','','Тема: '+f.subject.value.trim(),'Имя и компания: '+f.contact.value.trim(),'Телефон: '+(f.phone.value.trim()||'не указан'),'Email: '+(f.email.value.trim()||'не указан'),'','Техническое задание:',f.specification.value.trim(),'','Прошу обсудить возможность изготовления краски, стоимость и сроки.','Согласен на использование указанных контактов для ответа на этот запрос.'].join('\n');
const link=document.getElementById('tz-mail');link.href='mailto:sales@volgakraski.ru?subject='+encodeURIComponent(f.subject.value.trim())+'&body='+encodeURIComponent(tzLetter);document.getElementById('tz-letter').textContent=tzLetter;document.getElementById('tz-copy-status').textContent='';tzResult.hidden=false;link.click();});
document.getElementById('tz-copy').addEventListener('click',async()=>{const status=document.getElementById('tz-copy-status');try{await navigator.clipboard.writeText(tzLetter);status.textContent='Текст скопирован.';}catch{tzResult.querySelector('details').open=true;status.textContent='Выделите и скопируйте текст запроса вручную.';}});
