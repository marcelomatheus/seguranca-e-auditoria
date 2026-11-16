import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlow, Background, Controls, Handle, Position, MarkerType, ReactFlowProvider, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Activity, ArrowDownRight, ArrowLeftRight, ArrowRight, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Clock3, Cloud, Database, Download, FileCheck2, Fingerprint, GitBranch, HardDrive, Info, KeyRound, Layers3, LockKeyhole, Maximize2, Menu, MonitorCheck, Network, Play, RotateCcw, Search, Server, Settings2, Shield, ShieldAlert, ShieldCheck, SlidersHorizontal, Sparkles, Wifi, X, Zap } from 'lucide-react'
import './styles.css'

const ICONS = { Activity, BookOpen, CircleAlert, Clock3, Cloud, Database, FileCheck2, Fingerprint, GitBranch, HardDrive, KeyRound, Layers3, LockKeyhole, MonitorCheck, Network, RotateCcw, Server, Shield, ShieldAlert, ShieldCheck, Wifi, Zap, Settings2 }
const cards = [
 { id:'architecture',num:'01',title:'Arquitetura & continuidade',short:'Infraestrutura',icon:'Network',intro:'Da dependência centralizada a uma operação resiliente.',value:'Reduz interrupções de pedidos, faturamento e logística.',baseline:'Um único data center concentra o ERP, o banco e os serviços de BI.',reference:'ISO 22301 · ISO/IEC 27002 · BIA',nodes:[
  {id:'erp',label:'ERP operacional',icon:'Server',before:'Servidor centralizado',after:'ERP em cluster',problem:'Paralisação de pedidos e faturamento quando o servidor falha.',solution:'Executar serviços críticos em cluster com procedimentos de failover documentados e testados.',value:'Mantém a operação comercial mesmo diante de falhas individuais.',evidence:'Teste de failover, monitoramento e RTO observado.',risk:'critical'},
  {id:'database',label:'Banco de dados',icon:'Database',before:'Instância única',after:'Primário + réplica',problem:'Uma falha no banco afeta todas as áreas.',solution:'Replicação supervisionada, alertas de lag e processo de promoção com prevenção de split-brain.',value:'Reduz a exposição a um ponto único de falha.',evidence:'Relatório de replicação, teste de promoção e conciliação.',risk:'critical'},
  {id:'power',label:'Energia',icon:'Zap',before:'Um circuito',after:'UPS + gerador',problem:'A pane elétrica de 2023 causou 18 horas de indisponibilidade.',solution:'Nobreak, gerador, redundância quando viável e testes de carga com registros.',value:'Ataca a causa imediata do incidente histórico.',evidence:'Laudos de manutenção e testes sob carga.',risk:'critical'},
  {id:'connectivity',label:'Conectividade',icon:'Wifi',before:'Um link de internet',after:'Links independentes',problem:'CD e filiais dependem da mesma conexão.',solution:'Dois provedores com rotas distintas, VPN/SD-WAN e teste de comutação.',value:'Reduz isolamento de filiais e atrasos logísticos.',evidence:'Medição de failover e SLA dos provedores.',risk:'high'},
  {id:'recovery',label:'Ambiente alternativo',icon:'Cloud',before:'Sem DR operacional validado',after:'Standby em nuvem',problem:'Recuperação depende integralmente do site principal.',solution:'Implantar ambiente secundário e realizar exercícios periódicos de ativação e retorno.',value:'Permite retomar o negócio após perda do site.',evidence:'Ata do exercício de DR e tempos reais.',risk:'high'}
 ],edges:[['power','erp'],['connectivity','erp'],['erp','database'],['database','recovery']]},
 { id:'assets',num:'02',title:'Ativos & riscos',short:'Matriz de risco',icon:'ShieldAlert',intro:'O inventário se transforma em decisões de investimento.',value:'Direciona recursos para o risco com maior impacto no negócio.',baseline:'O plano lista riscos R1–R6 e medidas gerais, sem vincular cada risco a um dono e a uma evidência.',reference:'ISO/IEC 27005 · ISO/IEC 27001',nodes:[
  {id:'inventory',label:'Ativos críticos',icon:'Layers3',before:'Riscos R1–R6',after:'Inventário com proprietários',problem:'Riscos descritos sem rastreabilidade completa por ativo.',solution:'Registrar ERP, banco, backups, rede, energia, estações e dados: proprietário, classificação, localização e dependências.',value:'Revela prioridades e evita lacunas de proteção.',evidence:'Cadastro versionado dos ativos.',risk:'critical'},
  {id:'threat',label:'Cenários de ameaça',icon:'CircleAlert',before:'Ameaças listadas',after:'Cenários avaliados',problem:'Falta associação explícita entre vulnerabilidade, ameaça e impacto.',solution:'Relacionar ameaça, vulnerabilidade, probabilidade, impacto e controles vigentes para cada ativo.',value:'Permite justificar os controles com critérios repetíveis.',evidence:'Registro de cenários e premissas.',risk:'high'},
  {id:'matrix',label:'Tratamento do risco',icon:'Activity',before:'Ações dispersas',after:'Risco residual aprovado',problem:'Não há trilha formal de aceitação ou tratamento residual.',solution:'Definir evitar, mitigar, transferir ou aceitar, com responsável, prazo e aprovação do risco residual.',value:'Melhora governança e controle de gastos.',evidence:'Matriz aprovada pela direção.',risk:'high'},
  {id:'audit',label:'Auditoria',icon:'FileCheck2',before:'Indicadores de operação',after:'Evidências rastreáveis',problem:'Métricas por si só não comprovam execução de controles.',solution:'Relacionar cada controle a teste, periodicidade, evidência, resultado e ação corretiva.',value:'Torna a melhoria verificável.',evidence:'Plano e relatórios de auditoria.',risk:'medium'}
 ],edges:[['inventory','threat'],['threat','matrix'],['matrix','audit']]},
 { id:'identity',num:'03',title:'Controles lógicos & senhas',short:'Identidade e acesso',icon:'Fingerprint',intro:'Acesso legítimo, limitado, temporário e verificável.',value:'Diminui fraude, vazamento e abuso de privilégios.',baseline:'O plano já sugere MFA, menor privilégio e revisão periódica de acesso.',reference:'NIST SP 800-63B · ISO/IEC 27002',nodes:[
  {id:'joiner',label:'Ciclo de identidades',icon:'Fingerprint',before:'Perfis sugeridos',after:'Provisionamento JML',problem:'Admissões, mudanças e desligamentos sem workflow definido.',solution:'Automatizar abertura, alteração e revogação de acessos mediante aprovação e desligamento imediato.',value:'Evita contas órfãs e privilégios acumulados.',evidence:'Solicitações, aprovações e revogações.',risk:'critical'},
  {id:'rbac',label:'Privilégios',icon:'LockKeyhole',before:'Menor privilégio conceitual',after:'Matriz RBAC por função',problem:'Perfil por área sem matriz de permissões explícita.',solution:'Mapear papéis de vendas, estoque, finanças, logística e administração; aplicar separação de funções.',value:'Dificulta alterações não autorizadas e fraudes.',evidence:'Matriz RBAC e revisões trimestrais.',risk:'high'},
  {id:'password',label:'Política de senhas',icon:'KeyRound',before:'Sem norma detalhada',after:'Política verificável',problem:'Regras de credenciais não especificadas na proposta visual.',solution:'Exigir comprimento adequado, bloquear senhas comprometidas, oferecer gerenciador, limitar tentativas e evitar rotação arbitrária; MFA obrigatório para acessos privilegiados.',value:'Reduz comprometimento de credenciais.',evidence:'Configurações do IdP e testes.',risk:'high'},
  {id:'privileged',label:'Acesso administrativo',icon:'ShieldCheck',before:'MFA proposto',after:'PAM + trilha de sessão',problem:'Falta processo especial para sessões administrativas.',solution:'Contas nominativas, elevação just-in-time quando possível, MFA resistente a phishing e sessões auditáveis.',value:'Protege os sistemas de maior impacto.',evidence:'Logs de autenticação e elevação.',risk:'critical'}
 ],edges:[['joiner','rbac'],['rbac','password'],['password','privileged']]},
 { id:'restore',num:'04',title:'Backup & restauração',short:'Recuperação',icon:'RotateCcw',intro:'Backup não é recuperação até ser restaurado e validado.',value:'Reduz perda de dados e tempo de parada operacional.',baseline:'O plano já adota 3-2-1, cópias criptografadas, testes e metas preliminares de RPO/RTO.',reference:'ISO 22301 · ISO/IEC 27002 · NIST SP 800-34',nodes:[
  {id:'protect',label:'Proteção das cópias',icon:'HardDrive',before:'Backup 3-2-1 proposto',after:'3-2-1 + imutabilidade',problem:'Uma cópia acessível às mesmas credenciais ainda pode ser destruída.',solution:'Separar permissões de backup, imutabilidade, off-site, controle de chaves e monitoramento diário.',value:'Proteção reforçada contra ransomware.',evidence:'Configuração e teste de exclusão negada.',risk:'critical'},
  {id:'isolate',label:'Contenção',icon:'ShieldAlert',before:'Isolamento genérico',after:'Runbook de incidente',problem:'Um ambiente contaminado pode comprometer a restauração.',solution:'Acionar incidente, isolar origem, preservar evidências e escolher ponto limpo de recuperação.',value:'Evita reinfecção e recuperação insegura.',evidence:'Checklist assinado do incidente.',risk:'critical'},
  {id:'restore',label:'Restauração',icon:'RotateCcw',before:'Restaurar a cópia',after:'Ordem e dependências',problem:'A sequência técnica e as responsabilidades não estão detalhadas no resumo.',solution:'Restaurar infraestrutura, banco, ERP e integrações em ambiente isolado; conciliar pedidos e estoque.',value:'Retomada mais previsível.',evidence:'Runbook executado e checksum/consistência.',risk:'high'},
  {id:'measure',label:'Validação',icon:'MonitorCheck',before:'Teste trimestral no resumo',after:'Testes em camadas',problem:'Testes esporádicos podem não revelar falhas específicas.',solution:'Verificar jobs diariamente, amostras semanalmente, restauração integral mensalmente e failover trimestralmente.',value:'Aumenta a confiança na recuperação.',evidence:'RPO/RTO reais e plano corretivo.',risk:'high'}
 ],edges:[['protect','isolate'],['isolate','restore'],['restore','measure']]},
 { id:'lifecycle',num:'05',title:'Ciclo de vida dos dados',short:'Governança de dados',icon:'Database',intro:'Proteção da coleta ao descarte — sem dados esquecidos.',value:'Reduz exposição indevida e custos de retenção.',baseline:'O estudo já apresenta sete etapas de ciclo de vida e medidas alinhadas à LGPD.',reference:'LGPD (Lei 13.709/2018) · ISO/IEC 27002',nodes:[
  {id:'collect',label:'Coletar',icon:'BookOpen',before:'Minimização proposta',after:'Finalidade registrada',problem:'Sem inventário comprovado das bases legais por tratamento.',solution:'Mapear propósito, base legal, controlador, dado necessário e canal de transparência.',value:'Menos coleta desnecessária e maior transparência.',evidence:'Registro das operações de tratamento.',risk:'high'},
  {id:'classify',label:'Classificar',icon:'Layers3',before:'Categorias genéricas',after:'Classificação + owner',problem:'Classificação sem responsável operacional definido por conjunto.',solution:'Níveis público, interno, confidencial e restrito; atribuir proprietário e controles correspondentes.',value:'Aplica proteção proporcional à criticidade.',evidence:'Inventário rotulado e revisado.',risk:'medium'},
  {id:'use',label:'Tratar e compartilhar',icon:'Network',before:'Acesso por perfil',after:'Finalidade + rastreio',problem:'ETL e BI podem reproduzir identificadores desnecessários.',solution:'Pseudonimização, minimização nas integrações, controles de compartilhamento e trilhas de acesso.',value:'Reduz alcance de vazamentos no BI.',evidence:'Mapas de fluxo, logs e amostras.',risk:'high'},
  {id:'retain',label:'Reter e eliminar',icon:'Clock3',before:'Prazos sugeridos',after:'Tabela de temporalidade',problem:'Prazos ilustrativos não substituem análise legal por categoria.',solution:'Definir fundamento, prazo, retenções legais, descarte seguro e reaplicação de exclusões após restore.',value:'Menos dados expostos e descarte defensável.',evidence:'Tabela aprovada e certificados de descarte.',risk:'high'}
 ],edges:[['collect','classify'],['classify','use'],['use','retain']]},
 { id:'policy',num:'06',title:'Política de segurança',short:'Políticas & controles',icon:'FileCheck2',intro:'De recomendações técnicas a obrigações organizacionais.',value:'Cria regras aplicáveis, responsabilidades e prestação de contas.',baseline:'O documento apresenta controles de segurança, mas não uma PSI normativa consolidada.',reference:'ISO/IEC 27001 · ISO/IEC 27002 · TCU',nodes:[
  {id:'scope',label:'Escopo da PSI',icon:'FileCheck2',before:'Diretrizes no plano',after:'Política aprovada',problem:'Recomendações sem autoridade formal ou escopo de aplicação.',solution:'Publicar PSI com objetivos, princípios, abrangência, aprovação da direção e revisões anuais.',value:'Uniformiza decisões e responsabilização.',evidence:'Versão, aprovação e ciência dos usuários.',risk:'high'},
  {id:'standards',label:'Normas derivadas',icon:'BookOpen',before:'Controles descritos',after:'Normas específicas',problem:'Senha, acessos, ativos, backup e incidentes não formam um conjunto normativo uniforme.',solution:'Normas de identidade, autenticação, uso aceitável, classificação, criptografia, backup e descarte.',value:'Padroniza a execução diária.',evidence:'Procedimentos publicados e históricos.',risk:'medium'},
  {id:'roles',label:'Responsabilidades',icon:'Shield',before:'Responsáveis sugeridos',after:'RACI e exceções',problem:'Aprovação e execução ainda podem se confundir.',solution:'Definir papéis da diretoria, donos dos dados, TI, segurança, jurídico e auditoria; formalizar exceções temporárias.',value:'Evita decisões sem responsável.',evidence:'RACI, aprovações e exceções.',risk:'high'},
  {id:'audit',label:'Melhoria contínua',icon:'Activity',before:'Revisão anual',after:'PDCA e indicadores',problem:'Falta ligação direta entre achados, responsáveis e fechamento.',solution:'Auditoria periódica, indicadores, treinamento e ações corretivas com eficácia reavaliada.',value:'Comprova evolução dos controles.',evidence:'Plano de auditoria e evidência de fechamento.',risk:'medium'}
 ],edges:[['scope','standards'],['standards','roles'],['roles','audit']]},
 { id:'roadmap',num:'07',title:'Implantação gradual',short:'Plano de execução',icon:'GitBranch',intro:'A segurança evolui por etapas, sem interromper o negócio.',value:'Entrega valor imediato e distribui o investimento.',baseline:'O documento detalhado já traz quatro fases de implantação.',reference:'ISO/IEC 27001 · ISO 22301 · PDCA',nodes:[
  {id:'phase1',label:'0–30 dias',icon:'CircleAlert',before:'Plano inicial de ações',after:'Resposta imediata',problem:'Risco de recuperação não demonstrada.',solution:'Testar restore, inventariar ativos críticos, revisar acessos privilegiados e registrar riscos.',value:'Diminuição rápida do risco de paralisação.',evidence:'Relatório inicial e testes.',risk:'critical'},
  {id:'phase2',label:'31–90 dias',icon:'ShieldCheck',before:'Controles propostos',after:'Governança mínima',problem:'Ausência de padronização e responsabilização operacional.',solution:'Publicar PSI, matriz RBAC, política de senhas, rotinas de logs e processo de incidentes.',value:'Controles repetíveis e verificáveis.',evidence:'Políticas aprovadas e registros.',risk:'high'},
  {id:'phase3',label:'91–180 dias',icon:'Cloud',before:'Arquitetura desenhada',after:'Resiliência demonstrada',problem:'RPO/RTO podem permanecer somente metas.',solution:'Implantar redundância, ambientes alternativos e executar testes reais de failover.',value:'Continuidade comprovada com medições.',evidence:'Resultados de ensaios e SLA.',risk:'high'},
  {id:'phase4',label:'181–360 dias',icon:'MonitorCheck',before:'Revisão anual prevista',after:'Ciclo de auditoria',problem:'Melhorias podem perder força sem acompanhamento.',solution:'Treinar equipes, auditar controles, revisar riscos residuais e atualizar a direção.',value:'Proteção sustentável.',evidence:'Indicadores e ações corretivas encerradas.',risk:'medium'}
 ],edges:[['phase1','phase2'],['phase2','phase3'],['phase3','phase4']]}
]
const RISK = {critical:'CRÍTICO',high:'ALTO',medium:'MODERADO'}
function GraphNode({data,selected}) {
 const Icon = ICONS[data.icon] || Shield
 return <div className={'graph-node '+(selected?'selected ':'')+(data.isAfter?'after':'before')} title={data.tooltip} onClick={()=>data.open(data.item)}>
  <Handle type="target" position={Position.Left} className="port" />
  <div className="node-top"><span className="node-icon"><Icon size={18} strokeWidth={1.8}/></span><span className={'risk risk-'+data.risk}>{RISK[data.risk]}</span></div>
  <strong>{data.label}</strong><span className="node-description">{data.isAfter?data.item.after:data.item.before}</span>
  <div className="node-foot"><span>{data.isAfter?'REFINAMENTO':'BASE ORIGINAL'}</span><ArrowUpRightIcon/></div>
  <Handle type="source" position={Position.Right} className="port"/>
 </div>
}
function ArrowUpRightIcon(){return <ArrowRight size={14} />}
const nodeTypes = {security:GraphNode}
function Canvas({topic,phase,selected,onSelect,instanceRef}) {
 const flow=useReactFlow()
 const isAfter=phase==='after'
 const count=topic.nodes.length
 const positions=count===5?[[70,100],[460,100],[70,365],[460,365],[850,230]]:count===4?[[75,200],[440,200],[805,200],[1170,200]]:[]
 const nodes=useMemo(()=>topic.nodes.map((item,index)=>({id:item.id,type:'security',position:{x:positions[index]?.[0]||80+index*320,y:positions[index]?.[1]||180},selected:selected?.id===item.id,data:{item,icon:item.icon,risk:item.risk,label:item.label,isAfter,tooltip:item.problem,open:onSelect}})),[topic,phase,selected,onSelect])
 const edges=useMemo(()=>topic.edges.map(([source,target],i)=>({id:'edge-'+i,source,target,type:'smoothstep',animated:isAfter,style:{stroke:isAfter?'#8cc7a2':'#82766e',strokeWidth:isAfter?2.2:1.5},markerEnd:{type:MarkerType.ArrowClosed,color:isAfter?'#8cc7a2':'#82766e',width:15,height:15}})),[topic,phase])
 useEffect(()=>{const timer=setTimeout(()=>flow.fitView({padding:.17,duration:650,maxZoom:1.08}),100);return()=>clearTimeout(timer)},[topic.id,phase,flow])
 return <ReactFlow key={topic.id+'-'+phase} nodes={nodes} edges={edges} nodeTypes={nodeTypes} onPaneClick={()=>onSelect(null)} onInit={instanceRef} fitView fitViewOptions={{padding:.18}} nodesDraggable={false} nodesConnectable={false} elementsSelectable={true} minZoom={.35} maxZoom={1.7} proOptions={{hideAttribution:true}} colorMode="dark">
   <Background variant="dots" gap={22} size={1.2} color="#334244" />
   <Controls showInteractive={false} position="bottom-left" />
 </ReactFlow>
}
function Board({topic,phase,selected,onSelect,instanceRef}){return <ReactFlowProvider><Canvas topic={topic} phase={phase} selected={selected} onSelect={onSelect} instanceRef={instanceRef}/></ReactFlowProvider>}
function App(){
 const [active,setActive]=useState('architecture')
 const [phase,setPhase]=useState('after')
 const [comparison,setComparison]=useState(false)
 const [selected,setSelected]=useState(null)
 const [sidebar,setSidebar]=useState(false)
 const [isExporting,setIsExporting]=useState(false)
 const [search,setSearch]=useState('')
 const [showSources,setShowSources]=useState(false)
 const boardRef=useRef(null)
 const topic=cards.find(t=>t.id===active)||cards[0]
 const currentIndex=cards.findIndex(t=>t.id===active)
 const filtered=cards.filter(t=>(t.title+' '+t.short).toLowerCase().includes(search.toLowerCase()))
 const changeTopic=(id)=>{setActive(id);setSelected(null);setSidebar(false)}
 const selectItem=useCallback((node)=>setSelected(node),[])
 const setPhaseSafe=(v)=>{setPhase(v);setSelected(null)}
 const downloadPdf=async()=>{
  if(isExporting)return
  setIsExporting(true)
  try{
   const board=boardRef.current
   const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'})
   const shot=await toPng(board,{backgroundColor:'#162022',pixelRatio:2,cacheBust:true,filter:node=>!node.classList?.contains('react-flow__controls')})
   doc.setFillColor(17,25,27);doc.rect(0,0,297,210,'F')
   doc.setTextColor(240,238,229);doc.setFont('helvetica','bold');doc.setFontSize(17);doc.text('DELIMARKET  /  '+topic.title.toUpperCase(),15,17)
   doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(156,187,170);doc.text(comparison?'COMPARAÇÃO  /  ANTES × DEPOIS':phase==='after'?'ENGENHARIA REFINADA':'DIAGNÓSTICO ORIGINAL',15,24)
   doc.addImage(shot,'PNG',12,32,273,155,undefined,'FAST')
   doc.setTextColor(170,176,174);doc.setFontSize(8);doc.text('Segurança e Auditoria de Sistemas  •  Diagrama conceitual / DeliMarket',15,201)
   doc.save('delimarket-'+topic.id+(comparison?'-comparativo':'-'+phase)+'.pdf')
  }catch(e){console.error(e);alert('Não foi possível exportar este diagrama. Tente novamente.')}
  finally{setIsExporting(false)}
 }
 const currentMode=comparison?'comparison':phase
 return <div className="app">
  <aside className={'sidebar '+(sidebar?'sidebar-open':'')}>
   <div className="brand"><div className="brand-mark"><ShieldCheck size={22}/></div><div className="brand-copy"><strong>DELIMARKET<span className="brand-star">✳</span></strong><small>SECURITY ARCHITECTURE STUDIO</small></div><button className="mobile-close" onClick={()=>setSidebar(false)} aria-label="Fechar menu"><X size={18}/></button></div>
   <div className="workspace-label"><span>WORKSPACE / 01</span><span className="workspace-dot"/></div>
   <div className="project-title"><span className="project-square"><Layers3 size={18}/></span><div><strong>Reengenharia</strong><small>Auditoria de sistemas</small></div><ChevronDown size={15}/></div>
   <div className="sidebar-section-title">BOARDS <span>{String(cards.length).padStart(2,'0')}</span></div>
   <div className="search-wrap"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar board..." aria-label="Buscar board"/></div>
   <nav className="nav-list">{filtered.map(t=>{const Icon=ICONS[t.icon] || Shield;return <button key={t.id} className={'nav-item '+(active===t.id?'nav-active':'')} onClick={()=>changeTopic(t.id)}><span className="nav-icon"><Icon size={18} strokeWidth={1.8}/></span><span>{t.short}</span><small>{t.num}</small></button>})}{filtered.length===0&&<p className="empty">Nenhum board encontrado.</p>}</nav>
   <div className="sidebar-bottom"><div className="progress-header"><span>PLANO DE REENGENHARIA</span><span>07 / 07</span></div><div className="progress-track"><div/></div><div className="note"><span className="note-icon"><Sparkles size={17}/></span><div><strong>Uma arquitetura auditável</strong><p>Explore cada controle e compare sua evolução.</p></div></div><div className="sidebar-footer"><span className="online-pulse"/> Estudo de caso acadêmico <span className="footer-version">V1.0</span></div></div>
  </aside>
  {sidebar&&<div className="mobile-overlay" onClick={()=>setSidebar(false)}/>}
  <main className="main">
   <header className="topbar"><div className="breadcrumbs"><button className="mobile-menu" onClick={()=>setSidebar(true)} aria-label="Abrir menu"><Menu size={21}/></button><span>Workspace</span><ChevronRight size={14}/><span>Boards</span><ChevronRight size={14}/><strong>{topic.short}</strong></div><div className="top-actions"><span className="top-status"><span/> ESTUDO DE CASO</span><button className="icon-button sources-button" onClick={()=>setShowSources(!showSources)} title="Fontes e premissas"><BookOpen size={17}/></button><button className="export-button" onClick={downloadPdf} disabled={isExporting}><Download size={16}/>{isExporting?'Gerando PDF...':'Exportar PDF'}</button></div></header>
   <div className="content">
    <div className="eyebrow"><span className="eyebrow-line"/> BOARD {topic.num} / {String(cards.length).padStart(2,'0')} <span className="eyebrow-sep">·</span> SECURITY REVIEW</div>
    <div className="heading-row"><div><h1>{topic.title}<span className="heading-period">.</span></h1><p className="subtitle">{topic.intro}</p></div><div className="pagination"><button onClick={()=>changeTopic(cards[(currentIndex+cards.length-1)%cards.length].id)} aria-label="Board anterior"><ChevronLeft size={18}/></button><span>{topic.num} <i>/</i> 07</span><button onClick={()=>changeTopic(cards[(currentIndex+1)%cards.length].id)} aria-label="Próximo board"><ChevronRight size={18}/></button></div></div>
    <div className="value-ribbon"><div className="value-icon"><Activity size={18}/></div><span><strong>VALOR PARA O CLIENTE</strong> {topic.value}</span><span className="value-arrow"><ArrowDownRight size={18}/></span></div>
    <div className="canvas-toolbar"><div className="view-switch" role="group" aria-label="Modo de visualização"><button className={currentMode==='before'?'active':''} onClick={()=>{setComparison(false);setPhaseSafe('before')}}><CircleAlert size={15}/> Antes</button><button className={currentMode==='after'?'active':''} onClick={()=>{setComparison(false);setPhaseSafe('after')}}><ShieldCheck size={15}/> Depois</button><button className={currentMode==='comparison'?'active':''} onClick={()=>{setComparison(true);setSelected(null)}}><ArrowLeftRight size={15}/> Comparar</button></div><div className="toolbar-right"><span className="toolbar-hint"><span className="hint-point"/> CLIQUE NOS NÓS PARA EXPLORAR</span><span className="toolbar-divider"/><button className="tool-button" onClick={()=>setShowSources(!showSources)} title="Fundamentação"><Info size={17}/></button></div></div>
    <div className={'board-shell '+(comparison?'board-comparison':'')} ref={boardRef}>
      {comparison?<><div className="split-pane"><div className="pane-label old-label"><span/> ANTES <small>PROPOSTA ORIGINAL</small></div><Board topic={topic} phase="before" selected={selected} onSelect={selectItem}/></div><div className="split-pane"><div className="pane-label new-label"><span/> DEPOIS <small>REENGENHARIA</small></div><Board topic={topic} phase="after" selected={selected} onSelect={selectItem}/></div></>:<><div className="board-meta"><span className={'board-indicator '+(phase==='after'?'indicator-good':'indicator-old')}/><span>{phase==='after'?'ESTADO REFINADO':'ESTADO ORIGINAL'}</span><span className="meta-separator">/</span><span>{topic.nodes.length} COMPONENTES</span><span className="meta-separator">/</span><span>VISÃO CONCEITUAL</span></div><Board topic={topic} phase={phase} selected={selected} onSelect={selectItem}/></>}
      <div className="board-bottom-right"><span>DRAG TO PAN</span><span className="board-bottom-dot"/> <span>SCROLL TO ZOOM</span></div>
    </div>
    <div className="board-caption"><div><span className="caption-num">FIG. {topic.num}</span><strong>{topic.baseline}</strong></div><span className="caption-ref">{topic.reference}</span></div>
    <div className="bottom-guidance"><div className="guidance-icon"><GitBranch size={19}/></div><p><strong>Leitura técnica</strong> — os diagramas representam medidas propostas, não controles já comprovadamente implantados. A auditoria deve validar sua eficácia com evidências.</p></div>
   </div>
  </main>
  {selected&&<><div className="inspector-backdrop" onClick={()=>setSelected(null)}/><aside className="inspector"><div className="inspector-header"><span>CONTROLE / DETALHAMENTO</span><button onClick={()=>setSelected(null)} aria-label="Fechar detalhes"><X size={19}/></button></div><div className="inspector-body"><span className={'risk risk-'+selected.risk}>{RISK[selected.risk]}</span><div className="inspector-icon">{React.createElement(ICONS[selected.icon]||Shield,{size:28,strokeWidth:1.5})}</div><h2>{selected.label}</h2><p className="inspector-lead">Comparação técnica e justificativa da reengenharia.</p><div className="compare-box"><div><span>ANTES</span><p>{selected.before}</p></div><ArrowRight size={19}/><div><span>DEPOIS</span><p>{selected.after}</p></div></div><section><h3><CircleAlert size={16}/> LACUNA / RISCO</h3><p>{selected.problem}</p></section><section><h3><ShieldCheck size={16}/> REFINAMENTO PROPOSTO</h3><p>{selected.solution}</p></section><section><h3><Activity size={16}/> VALOR GERADO</h3><p>{selected.value}</p></section><section><h3><FileCheck2 size={16}/> EVIDÊNCIA DE AUDITORIA</h3><p>{selected.evidence}</p></section><section><h3><BookOpen size={16}/> REFERÊNCIA</h3><p>{topic.reference}</p></section></div><div className="inspector-bottom"><button onClick={()=>setSelected(null)}><Check size={16}/> Entendido</button></div></aside></>}
  {showSources&&<div className="sources-panel"><button className="sources-close" onClick={()=>setShowSources(false)}><X size={17}/></button><span className="sources-eyebrow">CRITÉRIOS DE ANÁLISE</span><h3>Fundamentação & premissas</h3><p>Estudo de caso DeliMarket: plano de ação e diagrama visual fornecidos no material acadêmico.</p><ul><li>ISO/IEC 27001 e 27002 — gestão e controles.</li><li>ISO/IEC 27005 — riscos de segurança.</li><li>ISO 22301 — continuidade do negócio.</li><li>NIST SP 800-63B — autenticação e senhas.</li><li>NIST SP 800-34 — planejamento de contingência.</li><li>LGPD — Lei nº 13.709/2018.</li></ul><p>Metas de RPO/RTO dependem da BIA; o plano visual apresenta 15 min/4 h e o detalhado propõe 5 min/1 h. Ambos são valores a validar.</p></div>}
 </div>
}
createRoot(document.getElementById('root')).render(<App/>)
