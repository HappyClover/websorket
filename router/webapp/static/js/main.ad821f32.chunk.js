(this.webpackJsonppage_transition=this.webpackJsonppage_transition||[]).push([[0],{61:function(e,t,c){},86:function(e,t){},90:function(e,t,c){"use strict";c.r(t);var a=c(0),r=c.n(a),n=c(17),i=c.n(n),s=c(5),o=c(6),l=c(18),d=c(8),j=c(7),u=c(12),h=c(3),b=c(53),O=(c(61),c.p+"static/media/back.362f030b.svg"),p=c.p+"static/media/exit.5b5e714c.svg",x=c.p+"static/media/kickboard.3d3acffc.svg",f=c.p+"static/media/chargePort.4d730b7a.svg",m=c(1),v=window.result,g=window.id,k=window.name,y=window.port,C=(window.code,window.name,window.key),w=window.msg,S=window.err_code;function _(e,t,c){if("success"===e){if("android"===P)window.wingstation.charge_start(k,y);else if("ios"===P){var a={station_name:k,port_numb:y};window.webkit.messageHandlers.charge_start.postMessage(JSON.stringify(a))}}else if("fail"===e)if("android"===P)window.wingstation.charge_fail(k,y,t,c);else if("ios"===P){var r={station_name:k,port_numb:y,err_code:t,msg:c};window.webkit.messageHandlers.charge_fail.postMessage(JSON.stringify(r))}}var N=c(63)(),P=function(){var e=navigator.userAgent.toLowerCase();return e.indexOf("android")>-1?"android":e.indexOf("iphone")>-1||e.indexOf("ipad")>-1||e.indexOf("ipod")>-1?"ios":"other"}(),T=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={time:a.props.time},a.decreaseTime=a.decreaseTime.bind(Object(l.a)(a)),a}return Object(o.a)(c,[{key:"decreaseTime",value:function(){var e=this.state.time;e>-2?this.setState({time:e-1}):(N.emit("charge_cancel"),this.props.timeOut(),clearInterval(this.timeID))}},{key:"componentDidMount",value:function(){this.timeID=setInterval(this.decreaseTime,1e3)}},{key:"render",value:function(){var e=this.state.time;return this.state.time<0&&(e=0),Object(m.jsxs)("div",{className:"clockContainer",children:[Object(m.jsx)("div",{className:"clock",children:e}),Object(m.jsx)("div",{className:"clockText",children:"\ucd08 \ud6c4\uc5d0 \uc790\ub3d9\uc73c\ub85c \ud654\uba74\uc774 \ub118\uc5b4\uac11\ub2c8\ub2e4."})]})}}]),c}(r.a.Component),q=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:"brochure",children:[Object(m.jsxs)("div",{className:"explainContainer",children:[Object(m.jsx)("img",{className:"kickboard",src:x,alt:"kickboard"}),Object(m.jsxs)("div",{className:"firstExplain",children:[Object(m.jsx)("div",{style:{fontSize:"13px",fontWeight:"400"},children:"01"}),Object(m.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\ud0a5\ubcf4\ub4dc\ub97c 0\ubc88 \uac70\uce58\ub300\uc5d0"}),Object(m.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\ub05d\uae4c\uc9c0 \ubc00\uc5b4\ub123\uc5b4 \uc8fc\uc138\uc694."})]})]}),Object(m.jsxs)("div",{className:"explainContainer",children:[Object(m.jsx)("img",{className:"chargePort",src:f,alt:"chargePort"}),Object(m.jsxs)("div",{className:"secondExplain",children:[Object(m.jsx)("div",{style:{fontSize:"13px",fontWeight:"400"},children:"02"}),Object(m.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\ub2e8\uc790\ub97c \uc62c\ubc14\ub974\uac8c \uaf42\uc544\uc8fc\uba74"}),Object(m.jsx)("div",{style:{fontSize:"12px",fontWeight:"700"},children:"\uc790\ub3d9\uc73c\ub85c \ucda9\uc804\uc774 \uc2dc\uc791\ub429\ub2c8\ub2e4."})]})]}),Object(m.jsx)("div",{className:"split"})]})}}]),c}(r.a.Component),z=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsx)("div",{className:"headerText",children:this.props.text})}}]),c}(r.a.Component),W=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){var e;return"back"===this.props.function?e=O:"exit"===this.props.function&&(e=p),Object(m.jsx)("img",{className:"headerButton",src:e,alt:"headerbutton"})}}]),c}(r.a.Component),E=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:"header",children:[Object(m.jsx)(W,{function:this.props.function}),Object(m.jsx)(z,{text:this.props.headerText})]})}}]),c}(r.a.Component),B=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={headerText:"\ucda9\uc804 \uc900\ube44"},a}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:"page chargeReady",children:[Object(m.jsx)(E,{headerText:this.state.headerText,function:"back"}),Object(m.jsx)(q,{}),Object(m.jsx)(T,{type:"next",time:30,timeOut:this.props.timeOut})]})}}]),c}(r.a.Component),D=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsx)("div",{className:"footerButtonContainer",children:Object(m.jsx)("button",{className:"footerButton",onClick:this.props.handleClick,children:this.props.text})})}}]),c}(r.a.Component),I=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsx)("div",{className:"plugContainer",children:Object(m.jsx)("div",{children:Object(m.jsx)("div",{children:Object(m.jsx)("div",{})})})})}}]),c}(r.a.Component),J=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsxs)(r.a.Fragment,{children:[Object(m.jsx)("div",{style:{fontSize:"18px",fontWeight:"700",color:"#FF9700",marginBottom:"7px"},children:"1\ubc88 \ud3ec\ud2b8"}),Object(m.jsx)("div",{style:{fontSize:"16px",fontWeight:"500",color:"#333333"},children:"\ucda9\uc804\uc774 \uc815\uc0c1\uc801\uc73c\ub85c"}),Object(m.jsx)("div",{style:{fontSize:"16px",fontWeight:"500",color:"#333333",marginBottom:"25px"},children:"\uc2dc\uc791\ub418\uc5c8\uc2b5\ub2c8\ub2e4."})]})}}]),c}(r.a.Component),F=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:"chargeDisplayContainer",children:[Object(m.jsx)(J,{}),Object(m.jsx)(I,{})]})}}]),c}(r.a.Component),H=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={headerText:"\ucda9\uc804 \uc131\uacf5"},a}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:"page chargeSuccess",children:[Object(m.jsx)(E,{headerText:this.state.headerText,function:"back"}),Object(m.jsx)(F,{}),Object(m.jsx)(T,{type:"back",time:5,timeOut:this.props.timeOut}),Object(m.jsx)(D,{text:"\uc885\ub8cc\ud558\uae30",handleClick:this.props.handleClick})]})}}]),c}(r.a.Component),M=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsx)("div",{className:"errorTextContainer",children:Object(m.jsx)("div",{className:"errorText",children:this.props.children})})}}]),c}(r.a.Component),L=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"displayPlug",value:function(){return"true"===this.props.havePlug?Object(m.jsx)(I,{}):(this.props.havePlug,null)}},{key:"render",value:function(){return Object(m.jsxs)("div",{className:"errorDisplayContainer",children:[Object(m.jsx)("div",{className:"errorHeadText",children:"\uc624\ub958\ubc1c\uc0dd"}),Object(m.jsx)(M,{children:this.props.children}),this.displayPlug()]})}}]),c}(r.a.Component),R=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(o.a)(c,[{key:"render",value:function(){return Object(m.jsxs)("div",{className:"page errorPage",children:[Object(m.jsx)(E,{headerText:"",function:"exit"}),Object(m.jsx)(L,{havePlug:this.props.havePlug,children:this.props.children}),Object(m.jsx)(D,{text:"\ub3cc\uc544\uac00\uae30",handleClick:this.props.handleClick})]})}}]),c}(r.a.Component),A=function(){return Object(m.jsxs)("div",{className:"nav",children:[Object(m.jsx)(u.b,{to:"/ready",className:"ready",replace:!0,children:"Home"}),Object(m.jsx)(u.b,{to:"/success",className:"success",replace:!0,children:"Success"}),Object(m.jsx)(u.b,{to:"/errorPage1",className:"error1",replace:!0,children:"ErrorPage1"}),Object(m.jsx)(u.b,{to:"/errorPage2",className:"error2",replace:!0,children:"ErrorPage2"}),Object(m.jsx)(u.b,{to:"/errorPage3",className:"error3",replace:!0,children:"ErrorPage3"}),Object(m.jsx)(u.b,{to:"/errorPage4",className:"error4",replace:!0,children:"ErrorPage4"})]})},K=function(e){Object(d.a)(c,e);var t=Object(j.a)(c);function c(e){var a;return Object(s.a)(this,c),(a=t.call(this,e)).state={state:"fail",back_count:0},a.handleClick=a.handleClick.bind(Object(l.a)(a)),a.timeOut=a.timeOut.bind(Object(l.a)(a)),a}return Object(o.a)(c,[{key:"handleClick",value:function(){if("fail"===this.state.state)_("fail",992,w),window.close();else if("back"===this.state.state){var e={station_id:g,port_numb:y};N.emit("port_ready",e),document.querySelector(".ready").click()}else"success"===this.state.state&&(_("success"),window.close())}},{key:"timeOut",value:function(){"success"===this.state.state?(_("success"),window.close()):(this.setState({back_count:this.state.back_count+1}),1===this.state.back_count?(document.querySelector(".error3").click(),this.setState({state:"back"})):2===this.state.back_count&&(document.querySelector(".error4").click(),this.setState({state:"fail"})))}},{key:"componentDidMount",value:function(){var e=this;if(N.on("charge_start",(function(t){console.log("charge_start event receive"),document.querySelector(".success").click(),e.setState({state:"success"}),_("success")})),N.on("charge_cancel",(function(t){console.log("charge_cancel event receive"),document.querySelector(".error4").click(),e.setState({state:"fail"}),_("fail",890,"\ucda9\uc804\uc774 \ucde8\uc18c\ub418\uc5c8\uc2b5\ub2c8\ub2e4. : \uc2dc\uac04\ucd08\uacfc")})),v){var t={api:C,type:"company"};console.log(t),N.emit("login",JSON.stringify(t)),N.on("result",(function(t){console.log("result event receive"),console.log(t);var c=t.data;switch(t.code){case"port_ready":console.log("port_ready event receive"),c?document.querySelector(".ready").click():(console.log(t),document.querySelector(".error4").click(),e.setState({state:"fail"}),_("fail",992,t.detail));break;case"port_cancel":console.log("port_cancel event receive"),c?0===e.state.back_count?(document.querySelector(".error3").click(),e.setState({state:"back",back_count:e.state.back_count+1}),N.emit("charge_cancel")):1===e.state.back_count&&(document.querySelector(".error4").click(),e.setState({state:"fail"}),N.emit("charge_cancel"),_("fail",999,"\uc0ac\uc6a9\uc790 \ucde8\uc18c \uc694\uccad")):(document.querySelector(".error4").click(),e.setState({state:"fail"}),N.emit("charge_cancel"),_("fail",999,"\uc0ac\uc6a9\uc790 \ucde8\uc18c \uc694\uccad"));break;case"login":if(console.log("login event receive"),c){console.log("login result true");var a={station_id:g,port_numb:y};N.emit("port_ready",a)}else console.log("login result false"),document.querySelector(".error4").click(),e.setState({state:"fail"})}}))}else switch(S){case 800:document.querySelector(".error1").click(),this.setState({state:"fail"});break;case 989:case 979:case 999:document.querySelector(".error4").click(),this.setState({state:"fail"})}}},{key:"render",value:function(){var e=this;return Object(m.jsxs)(u.a,{children:[Object(m.jsx)(A,{}),Object(m.jsx)(h.a,{render:function(t){var c=t.location;return Object(m.jsx)(b.a,{preset:"moveToLeftFromRight",transitionKey:c.pathname,children:Object(m.jsxs)(h.c,{location:c,children:[Object(m.jsx)(h.a,{exact:!0,path:"/ready",children:Object(m.jsx)(B,{timeOut:e.timeOut})}),Object(m.jsx)(h.a,{exact:!0,path:"/success",children:Object(m.jsx)(H,{handleClick:e.handleClick,timeOut:e.timeOut})}),Object(m.jsx)(h.a,{exact:!0,path:"/errorPage1",children:Object(m.jsxs)(R,{havePlug:"true",handleClick:e.handleClick,children:[Object(m.jsx)("div",{}),Object(m.jsx)("div",{children:"\uc544\ub798 \ubaa8\uc591\uc758 \ub2e8\uc790\ub97c \uac00\uc9c4 \ucda9\uc804\uc18c\uc5d0\uc11c \ucda9\uc804\ud574\uc8fc\uc138\uc694."})]})}),Object(m.jsx)(h.a,{exact:!0,path:"/errorPage2",children:Object(m.jsxs)(R,{havPlug:"false",handleClick:e.handleClick,children:[Object(m.jsx)("div",{children:"\ud604\uc7ac \uc774\uc6a9\uc774 \ubd88\uac00\ub2a5\ud55c \ucda9\uc804\uc18c\uc785\ub2c8\ub2e4."}),Object(m.jsx)("div",{children:"\ub2e4\ub978 \ucda9\uc804\uc18c\ub97c \uc774\uc6a9\ud574\uc8fc\uc138\uc694."})]})}),Object(m.jsx)(h.a,{exact:!0,path:"/errorPage3",children:Object(m.jsxs)(R,{havPlug:"false",handleClick:e.handleClick,children:[Object(m.jsx)("div",{children:"\ucda9\uc804\ub2e8\uc790\uac00 \uc815\uc0c1\uc801\uc73c\ub85c \uc778\uc2dd\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4."}),Object(m.jsx)("div",{children:"\ud0a5\ubcf4\ub4dc\uc5d0 \ub2e8\uc790\ub97c \uc62c\ubc14\ub974\uac8c \uc0bd\uc785\ud574\uc8fc\uc138\uc694."})]})}),Object(m.jsx)(h.a,{exact:!0,path:"/errorPage4",children:Object(m.jsx)(R,{havPlug:"false",handleClick:e.handleClick,children:Object(m.jsx)("div",{children:"\ucda9\uc804\uc18c \uc774\uc6a9\uc744 \ub2e4\uc2dc \uc2dc\ub3c4\ud574\uc8fc\uc138\uc694."})})})]})})}})]})}}]),c}(r.a.Component);i.a.render(Object(m.jsx)(K,{}),document.getElementById("root"))}},[[90,1,2]]]);
//# sourceMappingURL=main.ad821f32.chunk.js.map