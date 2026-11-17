import React from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Blocks, BookOpen, CheckCircle2, ClipboardCheck, Database, FileCheck2, Fingerprint, Layers3, Network, Shield, ShieldCheck, Timer, Workflow } from 'lucide-react'

const sections = [
  {
    code:'01',id:'architecture',name:'Infraestrutura e continuidade',
    icon:Network,problem:'O plano anterior já mede RPO/RTO e prevê failover. O maior risco é a dependência entre ERP, serviços de apoio e ambientes que podem falhar em conjunto.',
    response:'Corrigir metas de recuperação incompatíveis, eliminar falhas comuns e proteger a consistência do banco durante a comutação.',
    goal:'Continuidade sem falhas comuns'
  },
  {
    code:'02',id:'assets',name:'Ativos e riscos',
    icon:Layers3,problem:'O plano já contém matriz de riscos e BIA, mas falta rastrear controles, responsáveis e exposição residual.',
    response:'Relacionar ativos, cenários, responsáveis, evidências e decisões de tratamento de riscos.',
    goal:'Riscos rastreáveis'
  },
  {
    code:'03',id:'identity',name:'Identidade e acesso',
    icon:Fingerprint,problem:'MFA, menor privilégio e revisão de acessos já são previstos, sem todos os procedimentos de concessão e revogação.',
    response:'Formalizar matriz de permissões, política de senhas, ciclo de identidades e auditoria de acessos.',
    goal:'Acessos verificáveis'
  },
  {
    code:'04',id:'restore',name:'Backup e recuperação',
    icon:Database,problem:'O projeto anterior já propõe backups 3-2-1, imutabilidade e testes, mas exige critérios claros para restaurar com segurança.',
    response:'Estabelecer runbooks, validar dados recuperados e registrar os tempos reais de restauração.',
    goal:'Recuperação confiável'
  },
  {
    code:'05',id:'lifecycle',name:'Dados e LGPD',
    icon:ShieldCheck,problem:'Finalidade, retenção, classificação e descarte já constam do plano; a aplicação precisa ser demonstrável.',
    response:'Definir responsabilidades, registros de tratamento, verificações e evidências de eliminação.',
    goal:'Governança demonstrável'
  },
  {
    code:'06',id:'policy',name:'Política e auditoria',
    icon:FileCheck2,problem:'As orientações de segurança estão distribuídas no projeto, mas faltam consolidação e controle institucional.',
    response:'Formalizar a PSI, papéis, normas derivadas, gestão de exceções e verificação periódica.',
    goal:'Controles auditáveis'
  },
  {
    code:'07',id:'roadmap',name:'Implantação e evolução',
    icon:Workflow,problem:'O cronograma anterior já define fases, responsáveis e indicadores, mas necessita de aceites e acompanhamento.',
    response:'Acrescentar critérios de conclusão, retestes e monitoramento dos resultados por etapa.',
    goal:'Execução mensurável'
  }
]

const principles=[
  {icon:Shield,name:'Segurança',description:'Transformar diretrizes em controles verificáveis.'},
  {icon:Timer,name:'Continuidade',description:'Validar recuperação, disponibilidade e dependências.'},
  {icon:ClipboardCheck,name:'Auditoria',description:'Registrar resultados, responsáveis e evidências.'}
]

export default function Overview({onOpenBoard,onOpenReferences}){
 return <main className="overview-page" aria-label="Visão geral da reengenharia">
  <section className="overview-hero">
   <div className="overview-container overview-hero-inner">
    <div className="overview-hero-left">
      <div className="overview-eyebrow"><span className="overview-live-mark"/> DELIMARKET / SEGURANÇA E AUDITORIA</div>
      <h1>Da arquitetura proposta à <em>segurança verificável.</em></h1>
      <p>Uma visão executiva das lacunas identificadas no projeto anterior e das melhorias previstas para tornar seus controles mais claros, testáveis e auditáveis.</p>
      <div className="overview-hero-actions">
       <button className="overview-primary-action" onClick={()=>onOpenBoard('architecture')}>Explorar diagramas <ArrowUpRight size={17}/></button>
       <button className="overview-secondary-action" onClick={onOpenReferences}>Fontes e premissas <BookOpen size={15}/></button>
      </div>
    </div>
    <div className="overview-hero-right" aria-label="Síntese da proposta">
      <div className="overview-orbit overview-orbit-one"/>
      <div className="overview-orbit overview-orbit-two"/>
      <div className="overview-core"><ShieldCheck size={37} strokeWidth={1.45}/><span>REENGENHARIA</span></div>
      <span className="overview-orbit-tag overview-tag-top"><span/> CONTROLES</span>
      <span className="overview-orbit-tag overview-tag-left"><span/> EVIDÊNCIAS</span>
      <span className="overview-orbit-tag overview-tag-bottom"><span/> CONTINUIDADE</span>
    </div>
   </div>
  </section>

  <section className="overview-intro overview-container">
   <div className="overview-section-kicker">01 / CONTEXTO</div>
   <div className="overview-context-grid">
    <h2>O projeto anterior já tinha uma base sólida.</h2>
    <div className="overview-context-body">
     <p>O trabalho precedente já propôs <strong>arquitetura híbrida, redundância, backups protegidos, controle de acesso, políticas de dados e continuidade</strong>. O ponto de partida desta análise é essa proposta — não o cenário de falha original da empresa.</p>
     <p>Nossa reengenharia se concentra no que ainda precisa ser <strong>especificado, formalizado e demonstrado por testes e auditorias</strong>. Trata-se de uma proposta acadêmica, sem evidência de implantação real.</p>
    </div>
   </div>
   <div className="overview-principles">{principles.map(({icon:Icon,name,description})=><div className="overview-principle" key={name}><Icon size={21} strokeWidth={1.5}/><div><strong>{name}</strong><p>{description}</p></div></div>)}</div>
  </section>

  <section className="overview-workstreams">
   <div className="overview-container">
    <div className="overview-section-kicker">02 / OPORTUNIDADES DE MELHORIA</div>
    <div className="overview-workstreams-title"><h2>Problemas identificados.<br/>Soluções propostas.</h2><p>Sete frentes de aprimoramento, resumidas em linguagem de negócio. Os detalhes técnicos estão nos diagramas interativos.</p></div>
    <div className="overview-workstream-grid">{sections.map(item=><button key={item.id} className="overview-workstream" onClick={()=>onOpenBoard(item.id)}>
     <div className="overview-workstream-top"><span className="overview-workstream-index">{item.code} / 07</span><item.icon size={21} strokeWidth={1.55}/></div>
     <h3>{item.name}</h3>
     <div className="overview-workstream-text"><span>DESAFIO</span><p>{item.problem}</p></div>
     <div className="overview-workstream-text"><span>RESPOSTA</span><p>{item.response}</p></div>
     <div className="overview-workstream-bottom"><span>{item.goal}</span><ArrowUpRight size={16}/></div>
    </button>)}</div>
   </div>
  </section>

  <section className="overview-outcome overview-container">
   <div className="overview-section-kicker">03 / RESULTADO ESPERADO</div>
   <div className="overview-outcome-inner">
    <div><h2>Menos suposições.<br/><em>Mais comprovação.</em></h2><p>O ganho esperado não é reconstruir a infraestrutura, mas elevar a qualidade de suas decisões de segurança e a capacidade de demonstrar que os controles funcionam.</p></div>
    <div className="overview-outcome-steps">
     {[
      ['01','Especificar','Regras e responsabilidades claras.'],
      ['02','Testar','Simulações e validações de eficácia.'],
      ['03','Auditar','Evidências, achados e melhoria contínua.']
     ].map(([number,title,caption])=><div key={number} className="overview-outcome-step"><span>{number}</span><div><strong>{title}</strong><p>{caption}</p></div><CheckCircle2 size={17}/></div>)}
    </div>
   </div>
   <div className="overview-end"><span>PRONTO PARA EXPLORAR?</span><button onClick={()=>onOpenBoard('architecture')}>Abrir primeiro diagrama <ArrowRight size={17}/></button></div>
  </section>
  <footer className="overview-footer"><div className="overview-container"><span>DELIMARKET · SECURITY STUDIO</span><span>ESTUDO DE CASO / PROPOSTAS SUJEITAS A VALIDAÇÃO</span></div></footer>
 </main>
}
