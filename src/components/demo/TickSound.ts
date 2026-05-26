/**
 * Som "tick-tick" gerado via Web Audio API (sem arquivo externo).
 * Imita o estalo de uma roleta física desacelerando.
 */
export class TickSound {
  private ctx: AudioContext | null = null;
  private timeoutId: number | null = null;

  start(durationMs: number): void {
    if (typeof window === "undefined") return;
    if (this.ctx) this.stop();

    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    this.ctx = new Ctor();
    const startTime = this.ctx.currentTime;

    // Densidade de ticks decresce ao longo do tempo (de ~8/s para ~1/s)
    let elapsed = 0;
    const schedule = () => {
      if (!this.ctx) return;
      this.playTick();
      const progress = elapsed / durationMs;
      // Intervalo cresce de 80ms para 600ms ao longo da duração
      const intervalMs = 80 + Math.pow(progress, 2) * 520;
      elapsed += intervalMs;
      if (elapsed < durationMs) {
        this.timeoutId = window.setTimeout(schedule, intervalMs);
      }
    };
    schedule();

    // Garante limpeza ao final
    void startTime;
  }

  private playTick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  stop(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
