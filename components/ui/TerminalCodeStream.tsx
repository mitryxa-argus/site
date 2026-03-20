'use client';

import { useRef, useEffect, useState } from "react";

const CODE_FRAGMENTS = [
  'ΔΣ::neural_init(0xFA3B)',
  'λ.pipe(model→infer)',
  '⟨tensor|reshape⟩::4D',
  'malloc(0xDEAD_BEEF)',
  'kernel<<<256,1024>>>()',
  '∂loss/∂θ = -0.0031',
  'ssh root@172.67.182.1',
  'SIGKILL → pid:4829',
  'jwt.verify(HS256,σ)',
  'SELECT ∑(nodes) FROM G',
  'docker.pull(core:αβ)',
  'TLS_AES_256▓▓▓OK',
  'POST /v1/infer ←200',
  'grad∇(W)·η=0.001',
  'syscall(SYS_mmap,0x7f)',
  'awk \'{print $NF}\'|sort',
  'CUDA:sm_89▸▸▸READY',
  'ffmpeg -i src -c:v h265',
  'chmod 755 /opt/ml/exec',
  'ping -c1 mitryxa.com✓',
  '0xCAFE→stack.push(λ)',
  'mutex.lock()||abort()',
  'wasm::instantiate(▒▒)',
  'openssl enc -aes-256',
  'git rebase -i HEAD~∞',
  'k8s.deploy(replicas:3)',
  'env.CUDA_VISIBLE=0,1',
  'tar xzf weights.tar.gz',
  'ncurses.init_pair(1,7)',
  'ioctl(fd,TCSETS,&tio)',
];

const GLITCH = 'アイウエオ░▒▓█◆◇●○∑∂λΔΣ∇θ';

const TerminalCodeStream = () => {
  const [display, setDisplay] = useState('');
  const mountedRef = useRef(true);
  const indexRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    const shuffled = [...CODE_FRAGMENTS].sort(() => Math.random() - 0.5);
    let frame: number;

    const tick = () => {
      if (!mountedRef.current) return;
      
      // Pick a random fragment every ~40ms
      const frag = shuffled[indexRef.current % shuffled.length];
      indexRef.current++;
      
      // Glitch 2-3 random chars
      const chars = frag.split('');
      const n = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        chars[idx] = GLITCH[Math.floor(Math.random() * GLITCH.length)];
      }
      setDisplay(chars.join(''));
      
      frame = window.setTimeout(tick, 30 + Math.random() * 40);
    };

    tick();
    return () => { mountedRef.current = false; clearTimeout(frame); };
  }, []);

  return (
    <div className="flex-1 overflow-hidden ml-2 h-[18px] relative">
      <span className="text-[10px] font-mono text-accent/80 truncate block leading-[18px]">
        <span className="text-muted-foreground/50">⟩</span> {display}
        <span className="inline-block w-[5px] h-[10px] bg-accent/70 ml-px animate-terminal-blink align-middle" />
      </span>
    </div>
  );
};

export default TerminalCodeStream;
