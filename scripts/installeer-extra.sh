#!/usr/bin/env bash
# Design Assistent: installeert de externe onderdelen.
#
#   bash scripts/installeer-extra.sh              # alles
#   bash scripts/installeer-extra.sh impeccable   # alleen impeccable (tip 11)
#   bash scripts/installeer-extra.sh hyperframes  # alleen HyperFrames (tip 24)
#   bash scripts/installeer-extra.sh python       # pakketten voor Design OS (tip 25)
#   bash scripts/installeer-extra.sh whisper      # Whisper voor transcripten (tip 24)
#
# Draai dit vanuit de root van de repo, op je eigen machine.

set -u
cd "$(dirname "$0")/.." || exit 1

ok()   { printf '\033[32m✓\033[0m %s\n' "$1"; }
warn() { printf '\033[33m!\033[0m %s\n' "$1"; }

have() { command -v "$1" >/dev/null 2>&1; }

impeccable() {
  echo "impeccable (tip 11)"
  if ! have npx; then warn "npx ontbreekt. Installeer Node.js 20+ en probeer opnieuw."; return; fi
  if npx -y impeccable install --providers=claude --scope=project; then
    ok "impeccable geïnstalleerd. Start in Claude Code met: /impeccable init"
  else
    warn "impeccable installeren mislukte. Zie https://github.com/pbakaus/impeccable"
  fi
}

hyperframes() {
  echo "HyperFrames (tip 24)"
  if have claude; then
    claude plugin marketplace add heygen-com/hyperframes \
      && claude plugin install hyperframes@hyperframes \
      && ok "HyperFrames-plugin geïnstalleerd. Gebruik /hyperframes:hyperframes" && return
  fi
  if have npx; then
    npx -y hyperframes skills update && ok "HyperFrames-skills geïnstalleerd" && return
  fi
  warn "HyperFrames niet geïnstalleerd. Zie https://github.com/heygen-com/hyperframes"
}

python_pakketten() {
  echo "Python-pakketten voor Design OS (tip 25)"
  if python3 -m pip install --user -U anthropic pillow; then
    ok "anthropic en pillow geïnstalleerd"
  else
    warn "pip lukte niet. Probeer: python3 -m pip install anthropic pillow"
  fi
  have ffmpeg && ok "ffmpeg gevonden (video's worden ook beschreven)" \
    || warn "ffmpeg ontbreekt. Optioneel, nodig om video's te beschrijven en voor Whisper."
}

whisper() {
  echo "Whisper (tip 24)"
  if python3 -m pip install --user -U openai-whisper; then
    ok "Whisper geïnstalleerd. Test: whisper video.mp4 --word_timestamps True --output_format json"
  else
    warn "Whisper installeren mislukte. Zie https://github.com/openai/whisper"
  fi
}

case "${1:-alles}" in
  impeccable)  impeccable ;;
  hyperframes) hyperframes ;;
  python)      python_pakketten ;;
  whisper)     whisper ;;
  alles)       impeccable; echo; hyperframes; echo; python_pakketten ;;
  *) echo "Onbekend onderdeel: $1"; exit 1 ;;
esac

echo
echo "Kie AI (tip 08) zet je op met /kie setup in Claude Code. Daar is een eigen API-sleutel voor nodig."
