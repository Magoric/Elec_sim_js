//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//************* Chip's library ************************
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

//Power Supply:
//Pins:
// 1) Output +5V
// 2) Output Ground.
function e_power(x,y)
{
 this.chip=chip;
 this.chip("Power",2,x,y);
 this.draw();
 this.set_engine(this.worker);
 
 this.set_pin_type(1,"o");
 this.set_pin_type(2,"o"); 

 this.call_engine();
}

e_power.prototype = new chip;

e_power.prototype.worker=function()
{
 this.set_volt(1,5);
 this.set_volt(2,GROUND);
}

//Led (rojo):
//Pins:
// 1) To positive voltage 
// 2) To Ground.
function e_red_led(x,y)
{
 this.chip=chip;
 this.chip("Red_LED",2,x,y);
 this.draw();
 this.set_engine(this.worker);
 this.call_engine();
 
 //--------------------------------
 
 this.broked=false;
}

e_red_led.prototype = new chip;

e_red_led.prototype.worker=function()
{
 var color='#000000';
 var c1;
 
 var v=this.get_volt(1);
 var g=this.get_volt(2);
 
 if(g==GROUND && v>0)
  {
   if(v>5) broked=true;
   else
    {
     c1=Math.floor(v*255/5); 
     color='#'+c1.toString(16).toUpperCase()+'0000';
    } 
  }
  
 if(this.broked==true) color='#000000';
 
 var centro_x=this.pos_x+chip_width/2;
 var centro_y=this.pos_y+(pin_high+space_between_pins);
 
 contexto.beginPath();
 contexto.arc(centro_x,centro_y,7,0,2*Math.PI);
 c1=contexto.fillStyle;
 contexto.fillStyle = color;
 contexto.fill(); 
 contexto.stroke(); 
 contexto.fillStyle=c1;
}


//Logic Timer. 0.5 seconds, change the signal (Invented chip for test):
//Pins:
// 1) logic signal
// 2) Ground.
// 3) No conected.
// 4) Input 5V.
function e_timer05(x,y)
{
 this.chip=chip;
 this.chip("Timer(0.5s)",4,x,y);
 this.draw();
 this.set_engine(this.worker);
 
 this.set_pin_type(1,"o");
 
 this.call_engine();
//------------------------------ 
 this.sennal=5;
 var d=new Date();
 
 this.last_time=null;
}

e_timer05.prototype = new chip;

e_timer05.prototype.worker=function()
{
 var f,t,d;
 
 d=new Date();
 t=d.getTime(); 
 
 if((t-this.last_time)>=500 || this.last_time==null)
  {
   this.last_time=d.getTime(); 

   timerid=window.setTimeout(this.worker.bind(this), 500);   
  
   if(this.get_volt(4)==5 && this.get_volt(2)==GROUND)
    { 
     if(this.sennal==5) this.sennal=0;
     else this.sennal=5;
          
     this.set_volt(1,this.sennal);   
    }
  }
}

//7400: Quad nand 
//Pins:
// 1) nand-1 input-1
// 2) nand-1 input-2
// 3) nand-1 output
// 4) nand-2 input-1
// 5) nand-2 input-2
// 6) nand-2 output
// 7) GND
// 8) nand-3 output
// 9) nand-3 input-1
// 10) nand-3 input-2
// 11) nand-3 output
// 12) nand-3 input-1
// 13) nand-3 input-2
// 14) Vcc
function e_7400(x,y)
{
 this.chip=chip;
 this.chip("7400",14,x,y);
 this.draw();
 this.set_engine(this.worker);
 
 this.set_pin_type(3,"o");
 this.set_pin_type(6,"o"); 
 this.set_pin_type(8,"o");
 this.set_pin_type(11,"o"); 
 
 this.call_engine();
}

e_7400.prototype = new chip;

e_7400.prototype.worker=function()
{
 var x,a,b,c,pa,pb,pc;
 
 if(this.get_volt(14)==5 && this.get_volt(7)==GROUND)
  {
   for(x=0; x<4; x++)
   { 	   
    if(x==0) {pa=1; pb=2; pc=3}
    if(x==1) {pa=4; pb=5; pc=6}
    if(x==2) {pa=9; pb=10; pc=8}
    if(x==3) {pa=12; pb=13; pc=11}
    
    a=this.get_volt(pa);  
    if(a>=4.75 && a<=5.25) a=1; else a=0;
   
    b=this.get_volt(pb);
    if(b>=4.75 && b<=5.25) b=1; else b=0;
   
    c=(~(a&b))&1; //nand.
    
    if(c==1) c=5;     else c=0;
    
    this.set_volt(pc,c);	  
   }
  }
}  

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//************* Chip's library ************************
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
