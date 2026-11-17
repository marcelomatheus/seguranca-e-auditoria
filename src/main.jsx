import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlow, Background, Controls, Handle, Position, MarkerType, ReactFlowProvider, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Activity, ArrowDownRight, ArrowLeftRight, ArrowRight, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Clock3, Cloud, Database, Download, FileCheck2, Fingerprint, GitBranch, HardDrive, Info, KeyRound, Layers3, LockKeyhole, Maximize2, Menu, MonitorCheck, Network, Play, RotateCcw, Search, Server, Settings2, Shield, ShieldAlert, ShieldCheck, SlidersHorizontal, Sparkles, Wifi, X, Zap } from 'lucide-react'
import { expandBoards } from './boardEnhancements'
import { refineInfrastructureComparison } from './infrastructureRefinement'
import { refineRemainingBoards } from './remainingBoardsRefinement'
import { diagramFor, routeLinks, CARD_WIDTH, CARD_HEIGHT } from './cleanDiagrams'
import { Users, Thermometer, CloudUpload, ChartNoAxesCombined, Radar, ClipboardCheck, Tags, Workflow, AlertTriangle, Gauge, ListChecks, FileWarning, FilePlus, RefreshCw, UserX, GitFork, Bot, ScrollText, Siren, CalendarClock, HardDriveDownload, BellRing, ScanSearch, Boxes, Timer, EyeOff, CalendarRange, MessageSquareText, Trash2, Landmark, GraduationCap } from 'lucide-react'
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

Object.assign(ICONS,{Users,Thermometer,CloudUpload,ChartNoAxesCombined,Radar,ClipboardCheck,Tags,Workflow,AlertTriangle,Gauge,ListChecks,FileWarning,FilePlus,RefreshCw,UserX,GitFork,Bot,ScrollText,Siren,CalendarClock,HardDriveDownload,BellRing,ScanSearch,Boxes,Timer,EyeOff,CalendarRange,MessageSquareText,Trash2,Landmark,GraduationCap,RotateCcw})
const BOARDS=expandBoards(cards).map(refineInfrastructureComparison).map(refineRemainingBoards)
const riskLabels={critical:'CRÍTICA',high:'ALTA',medium:'MODERADA'}
const stateLabels={before:'PROJETO ANTERIOR · PROPOSTA JÁ REFINADA',after:'REENGENHARIA PROPOSTA'}
const riskOrder={critical:0,high:1,medium:2}
function ComponentNode({data,selected}){
 const Icon=ICONS[data.item.icon]||Shield
 return <div className={'clean-card clean-card-severity-'+data.item.risk+' '+(data.after?'clean-card-after':'clean-card-before')+(selected?' clean-card-selected':'')} title={data.item.problem} tabIndex={0} role="button" aria-label={data.item.label} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();data.inspect(data.item)}}} onClick={()=>data.inspect(data.item)}>
  <Handle type="target" position={Position.Left} style={{opacity:0,pointerEvents:"none"}}/><Handle type="source" position={Position.Right} style={{opacity:0,pointerEvents:"none"}}/><div className="clean-card-line"><span className="clean-card-icon"><Icon size={19} strokeWidth={1.7}/></span><span className={'clean-risk clean-risk-'+data.item.risk} title={'Gravidade da intervenção proposta: '+riskLabels[data.item.risk]}>● {riskLabels[data.item.risk]}</span></div>
  <strong>{data.item.label}</strong>
  <p>{data.after?data.item.after:data.item.before}</p>
 </div>
}
function FlowingEdge({id,data}){
 const points=data.points
 const path=points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ')
 const stroke=data.after?'#93aee1':'#baa4ab'
 return <g className="diagram-connection" data-animation="flow" data-testid="animated-connection">
  <defs><marker id={'head-'+id} viewBox="0 0 8 8" markerWidth="6" markerHeight="6" refX="7" refY="4" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 Z" fill={stroke}/></marker></defs>
  <path d={path} fill="none" stroke={stroke} strokeWidth="1.8" strokeOpacity=".65" strokeLinejoin="round" markerEnd={'url(#head-'+id+')'}/>
  <path d={path} fill="none" stroke={stroke} strokeWidth="2.7" strokeOpacity=".6" strokeDasharray="3 16" className="flow-trace" strokeLinejoin="round"/>
  <circle r="3.1" fill={stroke} opacity=".95">
    <animateMotion dur={String(3.1+data.index*.13)+'s'} repeatCount="indefinite" path={path} rotate="auto"/>
  </circle>
 </g>
}
const nodeTypes={component:ComponentNode}
const edgeTypes={flow:FlowingEdge}
function Diagram({board,phase,selected,onInspect}){
 const flow=useReactFlow()
 const after=phase==='after'
 const {nodes,edges}=useMemo(()=>{
  const diagram=diagramFor(board)
  const nodes=diagram.nodes.map(({item,x,y})=>({
   id:item.id,type:'component',position:{x,y},style:{width:CARD_WIDTH,height:CARD_HEIGHT},
   data:{item,after,inspect:onInspect},selected:selected?.id===item.id,draggable:false,connectable:false
  }))
  const connections=routeLinks(diagram).map((edge,index)=>({
   id:edge.id,source:edge.source,target:edge.target,type:'flow',
   data:{...edge,after,index},selectable:false,animated:false
  }))
  return {nodes,edges:connections}
 },[board,after,selected,onInspect])
 useEffect(()=>{const t=setTimeout(()=>flow.fitView({padding:.09,maxZoom:1.12,duration:420}),90);return()=>clearTimeout(t)},[board.id,phase,flow])
 return <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
  fitView fitViewOptions={{padding:.09}} minZoom={.28} maxZoom={1.8}
  nodesDraggable={false} nodesConnectable={false} elementsSelectable={true}
  onNodeClick={(_,node)=>onInspect(node.data.item)} colorMode="dark">
    <Background variant="dots" color="#343b4a" gap={24} size={1}/>
    <Controls showInteractive={false} position="bottom-left"/>
  </ReactFlow>
}
function DiagramBoard(props){return <ReactFlowProvider><Diagram {...props}/></ReactFlowProvider>}
function Inspector({item,board,onClose}){
 const Icon=ICONS[item.icon]||Shield
 return <><div className="backdrop" onClick={onClose}/><aside className="inspector" aria-label="Detalhamento do controle">
  <div className="inspector-top"><span>INSPEÇÃO DE COMPONENTE</span><button className="icon-action" onClick={onClose} aria-label="Fechar detalhes"><X size={18}/></button></div>
  <div className="inspector-scroll">
   <div className="inspect-symbol"><Icon size={25}/></div><div className={'severity severity-'+item.risk}>GRAVIDADE DA INTERVENÇÃO · {riskLabels[item.risk]}</div>
   <h2>{item.label}</h2><p className="inspect-subtitle">{board.title} / estudo de caso DeliMarket</p>
   <div className="delta"><div><span>ANTES</span><p>{item.before}</p></div><ArrowRight size={20}/><div><span>DEPOIS</span><p>{item.after}</p></div></div>
   {[['01 / LACUNA DO PROJETO ANTERIOR',item.problem],['02 / SOLUÇÃO PROPOSTA',item.solution],['03 / JUSTIFICATIVA TÉCNICA',item.value+' A medida responde ao problema descrito e deve ser validada por '+item.evidence.toLowerCase()+' Referência: '+board.reference],['04 / VALOR PARA A DELIMARKET',item.value],['05 / EVIDÊNCIA DE AUDITORIA',item.evidence],['06 / BASE TÉCNICA',board.reference]].map(([title,value])=><section key={title}><h3>{title}</h3><p>{value}</p></section>)}
   <div className="inspect-note">O estado “Antes” representa o projeto acadêmico anterior já proposto, não a infraestrutura original da DeliMarket. A aplicação não afirma que os controles já foram implantados.</div>
  </div>
 </aside></>
}
function Studio(){
 const [active,setActive]=useState('architecture')
 const [phase,setPhase]=useState('after')
 const [compare,setCompare]=useState(false)
 const [selected,setSelected]=useState(null)
 const [sources,setSources]=useState(false)
 const [exporting,setExporting]=useState(false)
 const [showTabs,setShowTabs]=useState(true)
 const [showHelp,setShowHelp]=useState(false)
 const boardRef=useRef(null)
 const board=BOARDS.find(x=>x.id===active)||BOARDS[0]
 const onInspect=useCallback(item=>setSelected(item),[])
 const pickBoard=id=>{setActive(id);setSelected(null)}
 const chooseMode=mode=>{setCompare(mode==='compare');if(mode!=='compare')setPhase(mode);setSelected(null)}
 const mode=compare?'compare':phase
 const originalCaption=board.id==='architecture'?'PROJETO ANTERIOR · ARQUITETURA HÍBRIDA':stateLabels.before
 const exportPdf=async()=>{
  if(exporting)return
  setExporting(true)
  try{
   const node=boardRef.current
   const image=await toPng(node,{pixelRatio:1.7,backgroundColor:'#0e1117',cacheBust:true,filter:element=>!element.classList?.contains('react-flow__controls')})
   const pdf=new jsPDF({format:'a3',orientation:'landscape',unit:'mm'})
   pdf.setFillColor(11,14,20);pdf.rect(0,0,420,297,'F')
   pdf.setTextColor(226,231,240);pdf.setFontSize(17);pdf.text('DELIMARKET   /   '+board.title.toUpperCase(),16,19)
   pdf.setFontSize(9);pdf.setTextColor(151,168,195);pdf.text(compare?'COMPARATIVO — PROJETO ANTERIOR / REENGENHARIA':phase==='before'?originalCaption:stateLabels.after,16,27)
   pdf.addImage(image,'PNG',13,37,394,241,undefined,'FAST')
   pdf.setTextColor(123,137,159);pdf.setFontSize(8);pdf.text('Segurança e Auditoria de Sistemas   •   Estudo de caso / propostas sujeitas a validação',16,288)
   pdf.save('delimarket-'+board.id+'-'+mode+'.pdf')
  }catch(error){console.error('Exportação falhou',error);alert('Não foi possível exportar o PDF. Verifique o console e tente novamente.')}
  finally{setExporting(false)}
 }
 const diagram=diagramFor(board)
 const totals={nodes:diagram.nodes.length,connections:diagram.links.length,critical:diagram.nodes.filter(n=>n.item.risk==='critical').length}
 return <div className="studio">
   <header className="app-header">
    <div className="identity"><span className="identity-symbol"><Shield size={17}/></span><strong>DELIMARKET</strong><span className="identity-divider"/><span>SECURITY STUDIO</span></div>
    <div className="header-middle"><span className="breadcrumb">REENGENHARIA /</span><span>{board.num} — {board.short}</span></div>
    <div className="header-actions"><button className="header-button" onClick={()=>setSources(true)}><BookOpen size={15}/><span>Referências</span></button><button className="header-button export" onClick={exportPdf} disabled={exporting}><Download size={15}/><span>{exporting?'Exportando...':'Exportar PDF'}</span></button></div>
   </header>
   <div className="board-topbar">
    <div className="board-identity"><div className="board-index">{board.num}</div><div className="board-name"><h1>{board.title}</h1><p>{board.intro}</p></div></div>
    <div className="board-actions">
     <span className="board-stat">{totals.nodes} <small>COMPONENTES</small></span><span className="board-stat">{totals.connections} <small>CONEXÕES</small></span>
     <div className="mode-picker" role="group" aria-label="Visualização"><button className={mode==='before'?'mode-active':''} onClick={()=>chooseMode('before')}>Antes</button><button className={mode==='after'?'mode-active':''} onClick={()=>chooseMode('after')}>Depois</button><button className={mode==='compare'?'mode-active':''} onClick={()=>chooseMode('compare')}><ArrowLeftRight size={13}/> Comparar</button></div>
    </div>
   </div>
   <main className={'canvas-stage '+(compare?'canvas-stage-compare':'')} ref={boardRef}>
    {compare?<><div className="comparison-pane"><span className="pane-badge pane-original"><span/> ANTES <small>{board.id==='architecture'?'PROJETO ANTERIOR · ARQUITETURA HÍBRIDA':stateLabels.before}</small></span><DiagramBoard key={board.id+'before'} board={board} phase="before" selected={selected} onInspect={onInspect}/></div><div className="comparison-pane"><span className="pane-badge pane-proposal"><span/> DEPOIS <small>PROPOSTA DE REENGENHARIA</small></span><DiagramBoard key={board.id+'after'} board={board} phase="after" selected={selected} onInspect={onInspect}/></div></>:<><span className={'stage-state '+(phase==='after'?'stage-after':'stage-before')}><span/> {phase==='before'?originalCaption:stateLabels.after}</span><DiagramBoard key={board.id+phase} board={board} phase={phase} selected={selected} onInspect={onInspect}/></>}
    <div className="canvas-legend" aria-label="Gravidade das intervenções"><strong>GRAVIDADE DA INTERVENÇÃO</strong><span><i className="severity-key severity-key-critical"/> CRÍTICA</span><span><i className="severity-key severity-key-high"/> ALTA</span><span><i className="severity-key severity-key-medium"/> MODERADA</span></div>
    <div className="canvas-guidance"><button onClick={()=>setShowHelp(!showHelp)} title="Instruções"><Info size={15}/></button>{showHelp&&<span>Arraste para navegar · Scroll para ampliar · Clique no componente para analisar · Use “Comparar” para visualizar a evolução</span>}</div>
   </main>
   <footer className="sheetbar">
    <div className="sheetbar-label"><Layers3 size={16}/><span>BOARDS</span></div>
    <div className="sheet-tabs" role="tablist" aria-label="Diagramas de segurança">{BOARDS.map(item=>{const Icon=ICONS[item.icon]||Shield;return <button role="tab" aria-selected={active===item.id} key={item.id} className={'sheet-tab '+(active===item.id?'sheet-tab-active':'')} onClick={()=>pickBoard(item.id)} title={item.title}><Icon size={15}/><span>{item.short}</span><small>{item.num}</small></button>})}</div>
    <div className="sheet-right"><span><span className="status-dot"/> VISÃO CONCEITUAL</span></div>
   </footer>
   {selected&&<Inspector item={selected} board={board} onClose={()=>setSelected(null)}/>}
   {sources&&<><div className="backdrop" onClick={()=>setSources(false)}/><aside className="references-panel"><div className="inspector-top"><span>FONTES E PREMISSAS</span><button className="icon-action" onClick={()=>setSources(false)}><X size={18}/></button></div><div className="references-body"><h2>Base do estudo</h2><p>O redesenho parte do plano visual e do documento detalhado da DeliMarket. A arquitetura é uma proposta acadêmica, sem alegação de instalação real dos controles.</p><h3>REFERÊNCIAS TÉCNICAS</h3><ul><li>ISO/IEC 27001, 27002 e 27005 — gestão, controles e riscos.</li><li>ISO 22301 — continuidade de negócios.</li><li>NIST SP 800-34 — planejamento de contingência.</li><li>NIST SP 800-63B — senhas, MFA e autenticação.</li><li>LGPD (Lei 13.709/2018) — tratamento e proteção de dados.</li><li>TCU — boas práticas em Segurança da Informação.</li></ul><h3>NOTA SOBRE METAS</h3><p>O material visual propõe RPO ≤ 15 min e RTO ≤ 4 h; o documento detalhado propõe RPO ≤ 5 min e RTO ≤ 1 h. As metas são alternativas a validar e aprovar mediante BIA.</p><h3>COMO LER OS BOARDS</h3><p>As conexões mostram dependências e fluxos. “Antes” é o plano acadêmico anterior já refinado; “Depois” adiciona detalhamento, procedimentos e critérios de auditoria. As cores dos cards expressam a gravidade proposta da intervenção (crítica, alta ou moderada), não a implementação do controle.</p></div></aside></>}
 </div>
}
createRoot(document.getElementById('root')).render(<Studio/>)
