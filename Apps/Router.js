import React from 'react';
import ReactDOM from 'react-dom';

function Emit(event, data){
    var e = new Event(event);
    e.data = data;
    window.dispatchEvent(e);
};

function Register(jsx, event, mnt){
    window.addEventListener(event, function(e){
        var data = e.data;
        ReactDOM.render(<jsx data={data}/>, mnt);
    });
};

export { Emit, Register };