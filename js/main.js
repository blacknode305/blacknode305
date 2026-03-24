const preview = document.getElementById('preview');
const start = document.getElementById('start');
const audio = document.getElementById('audio');

const content = document.getElementById('content');



document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    content.style.display = 'none';
    audio.pause();
    preview.style.display = 'flex';
  }
});
start.addEventListener('click', () => {
  preview.style.display = 'none';
  audio.src = 'src/audio/' + playlist[0];
  audio.currentTime = 0;
  audio.play().catch(e => console.log('Play failed', e));
  content.style.display = 'flex';
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
const playlist = [
  'Airixis - Universe.mp3',
  'Afrojack,_Steve_Aoki_feat_Miss_Palmer_No_Beef_feat_Miss_Pal.mp3',
  'Katana Zero - Full Confession.mp3',
  'Katana Zero - All For Now.mp3',
];