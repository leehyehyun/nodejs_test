window.onload=function(){
    document.f1.onsubmit=function(){
        var pw1 = document.f1.user_pw;
        var pw2 = document.f1.user_pw2;

        pw2.value=pw1.value;
        pw2.disabled = true;
        return false;
    }
    document.f2.allChk.onclick=function(){
        if(this.checked){
            document.f2.subject1.checked = true;
            document.f2.subject2.checked = true;
            document.f2.subject3.checked = true;
        }else{
            document.f2.subject1.checked = false;
            document.f2.subject2.checked = false;
            document.f2.subject3.checked = false;
        }
    }
    document.f2.onsubmit=function(){
        //여기하기
        var act=document.f2.accept;
        if(act.checked==false){
            alert("약관 동의해야 합니다.");
            act.focus();
            return false;
        }
    }
}