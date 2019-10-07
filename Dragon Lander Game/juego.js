(function(){
    'use strict';
    window.addEventListener('load',init,false);
    //redefinicion de mandos por las teclas AWD y ENTER
    var KEY_SPACE=32;
    var KEY_LEFT=65;
    var KEY_RIGHT=68;
    var KEY_REINICIAR=82;
	var KEY_UP=87;
	var KEY_ENTER=13;
    var K2=0.335;
	var G=0.07;
	var Fuel=150;
    var score=0;
	
    var canvas=null,ctx=null;
    var lastPress=null;
    var pressing=[];
    var player=new Circle(850,140,22);
    var iShip=new Image();
    iShip.src='ship.png';
   	var speedx=-1;
	var speedy=0;
	var pause=true;
    var gameover=false;
    
    // definir todos los archivos antes de que el juego las ocupe, ya que si no se hace esto
    //carga en el instante al empezar a jugar y se ve mal(fondo negro, etc).
    var wall=new Rectangle(700,300,50,40);
    var plataforma=new Image();
    plataforma.src='plataforma.png';
    player.rotation=-20;
    
    var fondo0=new Image();
    fondo0.src=('fondo.jpg');
    var fondo2=new Image();
    fondo2.src=('fondo2.jpg');
    var fondo3=new Image();
    fondo3.src=('fondo3.jpg');
    var fondo4=new Image();
    fondo4.src=('fondo4.jpg');
    var ganar=new Image();
    ganar.src=('ganar.jpg');
    
    var explosion=new Image();
    explosion.src=('explosion.jpg');
    var ship2=new Image();
    ship2.src=('ship2.jpg');
    var ship3=new Image();
    ship3.src=('ship3.jpg');
    
    
    

    function random(max){
        return Math.floor(Math.random()*max);
    }
 
    function init(){
        canvas=document.getElementById('canvas');
        ctx=canvas.getContext('2d');
        canvas.width=1200;
        canvas.height=600;
       
        run();
        repaint();
    }


    function run(){
        setTimeout(run,50);
        act();
    }

    function repaint(){
        requestAnimationFrame(repaint);
        paint(ctx);
    }
//-------------------------------------------------------------------
var contador = 0;

//Audios de explosion, sonido de fondo y propulsion
var explosion = new Audio('explosion.mp3');
var audio = new Audio("sonido.mp3");
var nave = new Audio('nave.mp3');

                                          
		function act(){
                   
                    				
					if(!pause){
                                            audio.play();
                    
				// Set Rotation
			if(pressing[KEY_LEFT]){
				
				if(player.rotation>-3600){
				player.rotation-=10;}
			}
                        
			if(pressing[KEY_RIGHT]){
			if(player.rotation<3600){
				player.rotation+=10;}
			}
						// Move x,y
			var rad=player.rotation/180*3.14159265359;
			if(Fuel==0){
                            if(pressing[KEY_UP]){
                              iShip.src='ship.png';  
                            }
                        }
                          if(!pressing[KEY_UP])
                        nave.pause();
                    
			if(Fuel>0){
                            //genera el sonido de propulsion, el if anterior es para que no se produzca un loop infinito de reproduccion del sonido(debe hacerse con lastpress).
                            if(lastPress==KEY_UP){
			 nave.play()
                         lastPress=null;                   
                                                                }
                    
			
				if(pressing[KEY_UP]){
					//sen
					speedx-=-K2*(Math.sin(rad));
					//cos
					speedy-=K2*(Math.cos(rad));
					Fuel=Fuel-1;
                                        iShip.src='ship2.png';
                                                                                
					}
				else{
                                    iShip.src='ship.png';
					if(speedx>0.1){
						speedx=speedx-0.005;
						}
					else{
						if(speedx<-0.1){
						speedx=speedx+0.005;
						}
						else{
						speedx=0;
						}
					}
				}
			}
			speedy=speedy+G;
			
			player.x+=speedx;
			player.y+=speedy;
			
			// Out Screen     
                        //suma el radio del circulo (desde el centro) para que cuando el borde de la nave toque los extremos, sea game over
			if(player.x+player.radius>canvas.width){
                pause=true;
                gameover=true;
                }
			if(player.y+player.radius>canvas.height){
                pause=true;
                gameover=true;
                }
			if(player.x-player.radius<0){
                pause=true;
                gameover=true;
                }
			if(player.y-player.radius<0){
                pause=true;
                gameover=true;
                }

            if(player.intersects(wall)){
                if(Math.round(speedx*10)<10&&Math.round(speedy*10)<10&&player.rotation==0){
                    Fuel=Fuel+150;
                    score=score+1;
                    wall.x=random(canvas.width/10-2)*10;                    
                    wall.y=(random(canvas.height/10-2)*10);
                    // corrije si la nave sale pegada en los extremos y le da un nuevo lugar.
                    if(wall.y < 120){
                        wall.y = 120;
                    }
                    if(wall.x < 120){
                        wall.x = 120;
                    }
                    if(wall.x > 1100){
                        wall.x = 1100;
                    }
                }
                else{
               // al perder se pausa la musica y se reproduce el sonido de explosion, ademas de activarse el gameover y pause(gameover no esta definido si no hay pausa)
               audio.pause();
               explosion.play();               
                plataforma.src='plataforma2.png';
                iShip.src='ship3.png';
                pause=true;
                gameover=true;
                }
            }

		}
		if(lastPress==KEY_ENTER){
			pause=!pause;
			lastPress=null;
		}
	}


    function paint(ctx){
	    
       // ctx.clearRect(0,0,canvas.width,canvas.height); 
//        var img= fondo
  //      var pat=ctx.createPattern(img,'no-repeat');
   //     ctx.rect(0,0,canvas.width,canvas.height);
    //    ctx.fillStyle=pat;
     //   ctx.fill();
        
             // wall.fill(ctx);
//        ctx.fillStyle='#f00';

		// Store the current transformation matrix
		ctx.save();
		
		// Use the identity matrix while clearing the canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Restore the transform
		ctx.restore();

                  

		ctx.fillStyle="transparent";
		ctx.fillRect(0,0,canvas.width, canvas.height);

        ctx.strokeStyle='#000';
        player.drawImage(ctx,iShip);
        
        if(pressing[KEY_SPACE])
            player.stroke(ctx);

        ctx.strokeStyle='#000';
        ctx.fillStyle='#49311C';
        // el fill quedo comentado, llenaba un lugar con un rect, ahora se usa el drawimage        
        //wall.fill(ctx);
        wall.drawImage(ctx,plataforma);


        ctx.fillStyle='#f00';
        

        
        ctx.fillStyle='#234';
        ctx.fillText('Rotación: '+player.rotation+'º',10,20);
		ctx.fillText('Velocidad Horizontal: '+Math.round(speedx*10)+' m/s',10,30);
		ctx.fillText('Velocidad Vertical: '+Math.round(speedy*10)+' m/s',10,40);
		ctx.fillText('Combustible: '+Fuel+' L',10,50);
        ctx.fillText('Esferas: '+score,10,60);
        if(pause){
            audio.pause();
                       $('#canvas').css('background','url(pausa.jpg)')
            ctx.textAlign='center';
            
                       if(gameover){
                           nave.pause();
                           //para reanudar el juego presionando Enter
                           if(lastPress==KEY_ENTER){
			 gameover=false,
                                 player.x=800;
                                 player.y=140;
                                 speedx=-1;
                                 speedy=0;
                                 score=0;
                                 Fuel=200;
                                 player.rotation=-10
                                 plataforma.src='plataforma.png';
                                 iShip.src='ship.png';
                                 wall.y=300;
                                 wall.x=700;                  
                                 lastPress=null;
		}
                //cambiar el fondo en game over para que no vuelva al fondo inicial al perder"
                       if(score==0)
                    $('#canvas').css('background','url(fondo.jpg)')
                    if (score == 1)
                      $('#canvas').css('background','url(fondo2.jpg)')
                  if(score==2)
                    $('#canvas').css('background','url(fondo2.jpg)')
                if (score == 3)
                    $('#canvas').css('background','url(fondo3.jpg)')
                 if (score == 4)
                    $('#canvas').css('background','url(fondo3.jpg)')
                if (score == 5)
                    $('#canvas').css('background','url(fondo4.jpg)')
                 if (score == 6)
                    $('#canvas').css('background','url(fondo4.jpg)')
                ctx.fillText('PERDISTE! SOLO PUDISTE RECOJER '+score+' ESFERAS,TRATA DE IR MAS DESPACIO CUANDO TE APROXIMES A LA PLATAFORMA, PRESIONA ENTER PARA REINICIAR EL JUEGO',600,150);
            }
            else
                               ctx.fillText('',600,200);
            ctx.textAlign='left';
        }
        if(!pause){   
            //mientras el usuario esta jugando el mapa va cambiando para dar una sensacion de avance
                        if(score==0)
                      if(score==0)
                    $('#canvas').css('background','url(fondo.jpg)')
                    if (score == 1)
                      $('#canvas').css('background','url(fondo2.jpg)')
                  if(score==2)
                    $('#canvas').css('background','url(fondo2.jpg)')
                if (score == 3)
                    $('#canvas').css('background','url(fondo3.jpg)')
                 if (score == 4)
                    $('#canvas').css('background','url(fondo3.jpg)')
                if (score == 5)
                    $('#canvas').css('background','url(fondo4.jpg)')
                 if (score == 6)
                    $('#canvas').css('background','url(fondo4.jpg)')
                if (score == 7){
                    ctx.fillText('YA CONSEGUISTE LAS 7 ESFERAS, ATERRIZA EN KAME HOUSE PARA LLAMAR A SHEN LONG',600,200);
                    //reubica la plataforma y la hace desaparecer del mapa 
                    wall.x=-100;
                    wall.y=-100;
                    if(750<player.x+player.radius&&player.x+player.radius<810&&500<player.y+player.radius&&player.y+player.radius<530){
                        //reubica la nave en la isla
                    player.x = 825;
                    player.y = 500;
                    G=0;
                    player.rotation=0;
                    speedx = 0;
                    speedy = 0;
                    KEY_UP=null;
                    KEY_LEFT=null;
                    KEY_RIGHT=null;
                    $('#canvas').css('background','url(ganar.jpg)')}
                                                                        }
                                                                        
        }
        
            }

    document.addEventListener('keydown',function(evt){
        lastPress=evt.keyCode;
        pressing[evt.keyCode]=true;
    },false);

    document.addEventListener('keyup',function(evt){
        pressing[evt.keyCode]=false;
    },false);

function Circle(x,y,radius){
    /* esta es otra forma de hacer if:
     * if(x == null){
     *      this.x = 0;
     * } else {
     *      this.x = x;
     * }
     */
    this.x=(x==null)?0:x;
    this.y=(y==null)?0:y;
    this.radius=(radius==null)?0:radius;
    this.scale=1;
    this.rotation=0;
    this.intersects=function(rect){
        if(rect!=null){
            return(this.x<rect.x+rect.width&&
                    this.x+this.radius>rect.x&&
                    this.y<rect.y+rect.height&&
                    this.y+this.radius>rect.y);
        }
    }
        this.stroke=function(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        ctx.stroke();
    }


    this.drawImage=function(ctx,img){
        if(img.width){
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.scale(this.scale,this.scale);
            ctx.rotate(this.rotation*Math.PI/180);
            ctx.drawImage(img,-img.width/2,-img.height/2);
            ctx.restore();
        }
        else{
            this.stroke(ctx);
        }
    }
}

function Rectangle(x,y,width,height){
    this.x=(x==null)?0:x;
    this.y=(y==null)?0:y;
    this.width=(width==null)?0:width;
    this.height=(height==null)?this.width:height;    

    //SE AGREGA EL SCALE PARA HACER ALGO PARECIDO A LO QUE HAY EN CIRCLE
    this.scale=1;  

    //FUNCION COMENTADA POR QUE NO SE USA  
    /*this.fill=function(ctx){
        if(ctx!=null){
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    }*/

    //NUEVA FUNCION BASADA EN LA DE CIRCLE PARA DIBUJAR EL RECTANGLE
    this.drawImage=function(ctx,img){
        if(img.width){
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.scale(this.scale,this.scale);
            //ctx.rotate(this.rotation*Math.PI/180);
            ctx.drawImage(img,-img.width/2,-img.height/2);
            ctx.restore();
        }
        else{
            this.stroke(ctx);
        }
    }
}

    window.requestAnimationFrame=(function(){
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            function(callback){window.setTimeout(callback,17);};
    })();
})();