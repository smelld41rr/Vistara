import type { StudioSettings } from "../shared/studio";
export class Moments {
  private last = "";
  private host: HTMLElement | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private audio: AudioContext | null = null;
  arm() {
    if (!this.audio) this.audio = new AudioContext();
    if (this.audio.state === "suspended")
      void this.audio.resume().catch(() => {});
  }
  update(label: string, settings: StudioSettings, reduced: boolean) {
    const value = label.trim().toLowerCase();
    if (!value || value === this.last) return;
    const initial = !this.last;
    this.last = value;
    if (initial || !settings.effects || !/^(accepted|ac)(\s|$)/i.test(value))
      return;
    this.host?.remove();
    const host = document.createElement("div");
    host.dataset.vistaraUi = "moment";
    const shadow = host.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `:host{position:fixed;right:24px;bottom:24px;z-index:2147483640;font:14px system-ui;color:#effff8}article{padding:22px 26px;border-radius:16px;border:1px solid #9df3c777;background:#102d2ef2;box-shadow:0 20px 80px #0005;${reduced ? "" : "animation:enter .3s ease-out"}}strong{font-size:19px}p{margin:7px 0 0;color:#b7dccc}button{float:right;background:none;border:0;color:inherit;cursor:pointer;font-size:20px;margin-left:20px}@keyframes enter{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){article{animation:none}}`;
    const card = document.createElement("article");
    card.setAttribute("role", "status");
    const close = document.createElement("button");
    close.textContent = "×";
    close.setAttribute("aria-label", "Dismiss accepted moment");
    close.onclick = () => this.host?.remove();
    const title = document.createElement("strong");
    title.textContent = "A little progress. A big feeling.";
    const detail = document.createElement("p");
    detail.textContent = "Accepted. Take a breath—you earned it.";
    card.append(close, title, detail);
    shadow.append(style, card);
    document.body.append(host);
    this.host = host;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => host.remove(), 5500);
    if (settings.sound && this.audio?.state === "running") {
      const oscillator = this.audio.createOscillator();
      const gain = this.audio.createGain();
      oscillator.connect(gain);
      gain.connect(this.audio.destination);
      gain.gain.setValueAtTime(settings.volume * 0.12, this.audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.audio.currentTime + 0.7,
      );
      oscillator.frequency.setValueAtTime(523.25, this.audio.currentTime);
      oscillator.frequency.setValueAtTime(
        659.25,
        this.audio.currentTime + 0.18,
      );
      oscillator.frequency.setValueAtTime(
        783.99,
        this.audio.currentTime + 0.36,
      );
      oscillator.start();
      oscillator.stop(this.audio.currentTime + 0.75);
    }
  }
  destroy() {
    clearTimeout(this.timer);
    this.host?.remove();
    this.host = null;
    void this.audio?.close().catch(() => {});
    this.audio = null;
  }
}
