(this.webpackJsonppage_transition=this.webpackJsonppage_transition||[]).push([[0],{61:function(e,t,c){},86:function(e,t){},90:function(e,t,c){"use strict";c.r(t);var a=c(0),r=c.n(a),n=c(17),i=c.n(n),s=c(5),o=c(6),l=c(18),d=c(8),j=c(7),h=c(12),u=c(3),b=c(53),O=(c(61),c.p+"static/media/back.362f030b.svg"),p=c.p+"static/media/exit.5b5e714c.svg",x=c.p+"static/media/kickboard.3d3acffc.svg",f=c.p+"static/media/chargePort.4d730b7a.svg",v=c(1),m=window.result,g=window.id,k=window.name,y=window.port,w=(window.code,window.name,window.key),C=window.msg,N=window.err_code;var _=c(63)(),S=function(){var e=navigator.userAgent.toLowerCase();return e.indexOf("android")>-1?"android":e.indexOf("iphone")>-1||e.indexOf("ipad")>-1||e.indexOf("ipod")>-1?"ios":"other"}(),P=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={time:a.props.time},a.decreaseTime=a.decreaseTime.bind(Object(l.a)(a)),a}return Object(o.a)(c,[{key:"decreaseTime",value:function(){var e=this.state.time;e>0?this.setState({time:e-1}):(_.emit("charge_cancel"),this.props.timeOut(),clearInterval(this.timeID))}},{key:"componentDidMount",value:function(){this.timeID=setInterval(this.decreaseTime,1e3)}},{key:"render",value:function(){return Object(v.jsxs)("div",{className:"clockContainer",children:[Object(v.jsx)("div",{className:"clock",children:this.state.time}),Object(v.jsx)("div",{className:"clockText",children:"\ucd08 \ud6c4\uc5d0 \uc790\ub3d9\uc73c\ub85c \ud654\uba74\uc774 \ub118\uc5b4\uac11\ub2c8\ub2e4."})]})}}]),c}(r.a.Component),T=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsxs)("div",{className:"brochure",children:[Object(v.jsxs)("div",{className:"explainContainer",children:[Object(v.jsx)("img",{className:"kickboard",src:x,alt:"kickboard"}),Object(v.jsxs)("div",{className:"firstExplain",children:[Object(v.jsx)("div",{style:{fontSize:"13px",fontWeight:"400"},children:"01"}),Object(v.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\ud0a5\ubcf4\ub4dc\ub97c 0\ubc88 \uac70\uce58\ub300\uc5d0"}),Object(v.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\ub05d\uae4c\uc9c0 \ubc00\uc5b4\ub123\uc5b4 \uc8fc\uc138\uc694."})]})]}),Object(v.jsxs)("div",{className:"explainContainer",children:[Object(v.jsx)("img",{className:"chargePort",src:f,alt:"chargePort"}),Object(v.jsxs)("div",{className:"secondExplain",children:[Object(v.jsx)("div",{style:{fontSize:"13px",fontWeight:"400"},children:"02"}),Object(v.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\ub2e8\uc790\ub97c \uc62c\ubc14\ub974\uac8c \uaf42\uc544\uc8fc\uba74"}),Object(v.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\uc790\ub3d9\uc73c\ub85c \ucda9\uc804\uc774 \uc2dc\uc791\ub429\ub2c8\ub2e4."})]})]}),Object(v.jsx)("div",{className:"split"})]})}}]),c}(r.a.Component),z=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsx)("div",{className:"headerText",children:this.props.text})}}]),c}(r.a.Component),W=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){var e;return"back"===this.props.function?e=O:"exit"===this.props.function&&(e=p),Object(v.jsx)("img",{className:"headerButton",src:e,alt:"headerbutton"})}}]),c}(r.a.Component),q=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsxs)("div",{className:"header",children:[Object(v.jsx)(W,{function:this.props.function}),Object(v.jsx)(z,{text:this.props.headerText})]})}}]),c}(r.a.Component),E=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={headerText:"\ucda9\uc804 \uc900\ube44"},a}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsxs)("div",{className:"page chargeReady",children:[Object(v.jsx)(q,{headerText:this.state.headerText,function:"back"}),Object(v.jsx)(T,{}),Object(v.jsx)(P,{type:"next",time:30,timeOut:this.props.timeOut})]})}}]),c}(r.a.Component),A=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsx)("div",{className:"footerButtonContainer",children:Object(v.jsx)("button",{className:"footerButton",onClick:this.props.handleClick,children:this.props.text})})}}]),c}(r.a.Component),B=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsx)("div",{className:"plugContainer",children:Object(v.jsx)("div",{children:Object(v.jsx)("div",{children:Object(v.jsx)("div",{})})})})}}]),c}(r.a.Component),D=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsxs)(r.a.Fragment,{children:[Object(v.jsx)("div",{style:{fontSize:"18px",fontWeight:"700",color:"#FF9700",marginBottom:"7px"},children:"1\ubc88 \ud3ec\ud2b8"}),Object(v.jsx)("div",{style:{fontSize:"16px",fontWeight:"500",color:"#333333"},children:"\ucda9\uc804\uc774 \uc815\uc0c1\uc801\uc73c\ub85c"}),Object(v.jsx)("div",{style:{fontSize:"16px",fontWeight:"500",color:"#333333",marginBottom:"25px"},children:"\uc2dc\uc791\ub418\uc5c8\uc2b5\ub2c8\ub2e4."})]})}}]),c}(r.a.Component),J=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsxs)("div",{className:"chargeDisplayContainer",children:[Object(v.jsx)(D,{}),Object(v.jsx)(B,{})]})}}]),c}(r.a.Component),H=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={headerText:"\ucda9\uc804 \uc131\uacf5"},a}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsxs)("div",{className:"page chargeSuccess",children:[Object(v.jsx)(q,{headerText:this.state.headerText,function:"back"}),Object(v.jsx)(J,{}),Object(v.jsx)(P,{type:"back",time:5,timeOut:this.props.timeOut}),Object(v.jsx)(A,{text:"\uc885\ub8cc\ud558\uae30",handleClick:this.props.handleClick})]})}}]),c}(r.a.Component),I=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsx)("div",{className:"errorTextContainer",children:Object(v.jsx)("div",{className:"errorText",children:this.props.children})})}}]),c}(r.a.Component),M=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"displayPlug",value:function(){return"true"===this.props.havePlug?Object(v.jsx)(B,{}):(this.props.havePlug,null)}},{key:"render",value:function(){return Object(v.jsxs)("div",{className:"errorDisplayContainer",children:[Object(v.jsx)("div",{className:"errorHeadText",children:"\uc624\ub958\ubc1c\uc0dd"}),Object(v.jsx)(I,{children:this.props.children}),this.displayPlug()]})}}]),c}(r.a.Component),F=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(v.jsxs)("div",{className:"page errorPage",children:[Object(v.jsx)(q,{headerText:"",function:"exit"}),Object(v.jsx)(M,{havePlug:this.props.havePlug,children:this.props.children}),Object(v.jsx)(A,{text:"\ub3cc\uc544\uac00\uae30",handleClick:this.props.handleClick})]})}}]),c}(r.a.Component),L=function(){return Object(v.jsxs)("div",{className:"nav",children:[Object(v.jsx)(h.b,{to:"/ready",className:"ready",replace:!0,children:"Home"}),Object(v.jsx)(h.b,{to:"/success",className:"success",children:"Success"}),Object(v.jsx)(h.b,{to:"/errorPage1",className:"error1",replace:!0,children:"ErrorPage1"}),Object(v.jsx)(h.b,{to:"/errorPage2",className:"error2",replace:!0,children:"ErrorPage2"}),Object(v.jsx)(h.b,{to:"/errorPage3",className:"error3",replace:!0,children:"ErrorPage3"}),Object(v.jsx)(h.b,{to:"/errorPage4",className:"error4",replace:!0,children:"ErrorPage4"})]})},R=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={state:"fail",back_count:0},a.handleClick=a.handleClick.bind(Object(l.a)(a)),a.timeOut=a.timeOut.bind(Object(l.a)(a)),a}return Object(o.a)(c,[{key:"handleClick",value:function(){if("fail"===this.state.state){if("android"===S)window.Android.charge_fail(k,y,992,C);else if("ios"===S){var e={station_name:k,port_numb:y,err_code:N,msg:C};window.webkit.messageHandlers.charge_fail.postMessage(JSON.stringfy(e))}window.close()}else if("back"===this.state.state){var t={station_id:g,port_numb:y};_.emit("port_ready",t),document.querySelector(".ready").click()}else if("success"===this.state.state){if("android"===S)window.Android.charge_start(k,y);else if("ios"===S){var c={station_id:g,port_numb:y};window.webkit.messageHandlers.charge_fail.postMessage(JSON.stringfy(c))}window.close()}}},{key:"timeOut",value:function(){if("success"===this.state.state){if("android"===S)window.Android.charge_start(k,y);else if("ios"===S){var e={station_id:g,port_numb:y};window.webkit.messageHandlers.charge_fail.postMessage(JSON.stringfy(e))}window.close()}else this.setState({back_count:this.state.back_count+1}),1===this.state.back_count?(document.querySelector(".error2").click(),this.setState({state:"back"})):2===this.state.back_count&&(document.querySelector(".error1").click(),this.setState({state:"fail"}))}},{key:"componentDidMount",value:function(){var e=this;if(m){var t={api:w,type:"company"};console.log(t),_.emit("login",JSON.stringify(t)),_.on("result",(function(t){console.log("result event receive"),console.log(t);var c=t.data;switch(t.code){case"port_ready":console.log("port_ready event receive"),c?document.querySelector(".ready").click():(console.log(t),window.Android.charge_fail(k,y,992,""+t.detail));break;case"port_cancel":console.log("port_cancel event receive"),c||(console.log(t),window.Android.charge_fail(k,y,999,"\uc0ac\uc6a9\uc790 \ucde8\uc18c \uc694\uccad"));break;case"login":if(console.log("login event receive"),c){var a={station_id:g,port_numb:y};_.emit("port_ready",a)}else document.querySelector(".error1").click(),e.setState({state:"fail"});break;case"charge_start":console.log("charge_start event receive"),document.querySelector(".success").click(),e.setState({state:"success"})}}))}else switch(N){case 800:document.querySelector(".error4").click(),this.setState({state:"fail"});break;case 989:case 979:case 999:document.querySelector(".error1").click(),this.setState({state:"fail"})}}},{key:"render",value:function(){var e=this;return Object(v.jsxs)(h.a,{children:[Object(v.jsx)(L,{}),Object(v.jsx)(u.a,{render:function(t){var c=t.location;return Object(v.jsx)(b.a,{preset:"moveToLeftFromRight",transitionKey:c.pathname,children:Object(v.jsxs)(u.c,{location:c,children:[Object(v.jsx)(u.a,{exact:!0,path:"/ready",children:Object(v.jsx)(E,{timeOut:e.timeOut})}),Object(v.jsx)(u.a,{exact:!0,path:"/success",children:Object(v.jsx)(H,{handleClick:e.handleClick,timeOut:e.timeOut})}),Object(v.jsx)(u.a,{exact:!0,path:"/errorPage1",children:Object(v.jsxs)(F,{havePlug:"true",handleClick:e.handleClick,children:[Object(v.jsx)("div",{}),Object(v.jsx)("div",{children:"\uc544\ub798 \ubaa8\uc591\uc758 \ub2e8\uc790\ub97c \uac00\uc9c4 \ucda9\uc804\uc18c\uc5d0\uc11c \ucda9\uc804\ud574\uc8fc\uc138\uc694."})]})}),Object(v.jsx)(u.a,{exact:!0,path:"/errorPage2",children:Object(v.jsxs)(F,{havPlug:"false",handleClick:e.handleClick,children:[Object(v.jsx)("div",{children:"\ud604\uc7ac \uc774\uc6a9\uc774 \ubd88\uac00\ub2a5\ud55c \ucda9\uc804\uc18c\uc785\ub2c8\ub2e4."}),Object(v.jsx)("div",{children:"\ub2e4\ub978 \ucda9\uc804\uc18c\ub97c \uc774\uc6a9\ud574\uc8fc\uc138\uc694."})]})}),Object(v.jsx)(u.a,{exact:!0,path:"/errorPage3",children:Object(v.jsxs)(F,{havPlug:"false",handleClick:e.handleClick,children:[Object(v.jsx)("div",{children:"\ucda9\uc804\ub2e8\uc790\uac00 \uc815\uc0c1\uc801\uc73c\ub85c \uc778\uc2dd\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4."}),Object(v.jsx)("div",{children:"\ud0a5\ubcf4\ub4dc\uc5d0 \ub2e8\uc790\ub97c \uc62c\ubc14\ub974\uac8c \uc0bd\uc785\ud574\uc8fc\uc138\uc694."})]})}),Object(v.jsx)(u.a,{exact:!0,path:"/errorPage4",children:Object(v.jsx)(F,{havPlug:"false",handleClick:e.handleClick,children:Object(v.jsx)("div",{children:"\ucda9\uc804\uc18c \uc774\uc6a9\uc744 \ub2e4\uc2dc \uc2dc\ub3c4\ud574\uc8fc\uc138\uc694."})})})]})})}})]})}}]),c}(r.a.Component);i.a.render(Object(v.jsx)(R,{}),document.getElementById("root"))}},[[90,1,2]]]);
//# sourceMappingURL=main.be568e8e.chunk.js.map