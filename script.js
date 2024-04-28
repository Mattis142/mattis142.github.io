document.addEventListener('DOMContentLoaded', () => {
  const randHue = Math.floor(Math.random() * 360);
  document.body.style.setProperty('--hue', randHue);
  textColor = randHue > 180 ? '#000000' : '#ffffff';

  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentNode;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;


  let radius = 0;
  if(isMobile()) {
    radius = 100;
  } else {
    radius = 200;
  }
  let x = radius + Math.floor(Math.random() * (canvas.width - radius * 2));
  let y = radius + Math.floor(Math.random() * (canvas.height - radius * 2));
  
  let dx = Math.random() > 0.5 ? -2 : 2;
  let dy = Math.random() > 0.5 ? -2 : 2;

  const move = () => {
    x += dx;
    y += dy;
    if (x + radius > canvas.width || x - radius < 0) dx = -dx;
    if (y + radius > canvas.height - 60 || y - radius < 0) dy = -dy;
  };

  const blurredCanvas = document.createElement('canvas');
  const blurredCtx = blurredCanvas.getContext('2d');
  blurredCanvas.width = canvas.width;
  blurredCanvas.height = canvas.height;


  // once the user reaches the #projects element, change the background to hsl(hue, 100%, 40%), instantly
  const projectsEl = document.querySelector('#projects');

  const updateBgColor = () => {
    const windowHeight = window.innerHeight;
    const projectsRect = projectsEl.getBoundingClientRect();
    const isProjectsVisible = projectsRect.top <= windowHeight / 2 && projectsRect.bottom >= 0;

    if (isProjectsVisible) {
      document.documentElement.style.setProperty('--bg', `hsl(${randHue}, 100%, 40%)`);
      document.documentElement.style.setProperty('--text-color', '#ffffff');
    } else {
      document.documentElement.style.setProperty('--bg', `hsl(${randHue}, 0%, 90%)`);
      document.documentElement.style.setProperty('--text-color', '#000000');
    }
  };

  window.addEventListener('scroll', updateBgColor);
  updateBgColor();



  const drawBlurredCircle = () => {
    if(isMobile()) {
      blurredCtx.filter = 'blur(20px)';
    } else {
      blurredCtx.filter = 'blur(50px)';
    }
    
    blurredCtx.clearRect(0, 0, blurredCanvas.width, blurredCanvas.height); // Clear the blurred canvas
    blurredCtx.beginPath();
    blurredCtx.arc(x, y, radius, 0, 2 * Math.PI);
    blurredCtx.fillStyle = `hsl(${randHue}, 100%, 60%)`;
    blurredCtx.fill();
    blurredCtx.closePath();
  };

  drawBlurredCircle();

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the main canvas
    ctx.drawImage(blurredCanvas, 0, 0);
    move();
    drawBlurredCircle();
    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => {
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    blurredCanvas.width = canvas.width;
    blurredCanvas.height = canvas.height;
    drawBlurredCircle();
  });

  draw();
});


function isMobile() {
  return window.innerWidth < 600;
}