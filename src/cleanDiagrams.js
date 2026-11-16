// Diagrams intentionally show only the structural elements. Details remain in the inspector.
// The same geometry is used for original and redesigned states so changes can be compared directly.
const grids = {
 architecture: {
  items: [
   ['users',0,0],['edge',1,0],['erp',2,0],['bi',3,0],
   ['connectivity',0,1],['power',1,1],['database',2,1],['etl',3,1],
   ['physical',0,2],['backup',1,2],['recovery',2,2],['immutable',3,2],
  ],
  links: [
   ['users','edge','acesso'],['edge','erp','pedidos'],['erp','database','transações'],
   ['connectivity','edge','link'],['power','erp','energia'],['physical','power','suporte'],
   ['database','backup','cópia'],['database','recovery','replicação'],
   ['backup','immutable','off-site'],['database','etl','dados'],['etl','bi','indicadores'],
   ['recovery','immutable','DR']
  ]
 },
 assets:{
  items:[
   ['inventory',0,0],['owners',1,0],['class',2,0],['dependencies',3,0],
   ['threat',0,1],['scenarios',1,1],['bia',2,1],['matrix',3,1],
   ['treat',0,2],['residual',1,2],['audit',2,2],['kri',3,2]
  ],
  links:[['inventory','owners'],['owners','class'],['class','dependencies'],['dependencies','threat'],['threat','scenarios'],['scenarios','bia'],['bia','matrix'],['matrix','treat'],['treat','residual'],['residual','audit'],['audit','kri']]
 },
 identity:{
  items:[
   ['request',0,0],['joiner',1,0],['move',2,0],['offboard',3,0],
   ['password',0,1],['mfa',1,1],['rbac',2,1],['sod',3,1],
   ['service',0,2],['privileged',1,2],['reviews',2,2],['logs',3,2]
  ],
  links:[['request','joiner'],['joiner','move'],['move','offboard'],['password','mfa'],['mfa','rbac'],['rbac','sod'],['service','privileged'],['privileged','reviews'],['reviews','logs'],['joiner','mfa'],['rbac','privileged']]
 },
 restore:{
  items:[
   ['schedule',0,0],['protect',1,0],['copies',2,0],['keys',3,0],
   ['detect',0,1],['isolate',1,1],['source',2,1],['infra',3,1],
   ['db',0,2],['restore',1,2],['validate',2,2],['rpor',3,2]
  ],
  links:[['schedule','protect'],['protect','copies'],['copies','keys'],['detect','isolate'],['isolate','source'],['source','infra'],['infra','db'],['db','restore'],['restore','validate'],['validate','rpor'],['copies','source']]
 },
 lifecycle:{
  items:[
   ['collect',0,0],['catalog',1,0],['legal',2,0],['use',3,0],
   ['quality',0,1],['minimize',1,1],['classify',2,1],['store',3,1],
   ['retain',0,2],['temporal',1,2],['delete',2,2],['replay',3,2]
  ],
  links:[['collect','catalog'],['catalog','legal'],['legal','use'],['use','quality'],['quality','minimize'],['minimize','classify'],['classify','store'],['store','retain'],['retain','temporal'],['temporal','delete'],['delete','replay']]
 },
 policy:{
  items:[
   ['board',0,0],['scope',1,0],['roles',2,0],['standards',3,0],
   ['passwords',0,1],['backup',1,1],['usage',2,1],['incident',3,1],
   ['train',0,2],['exceptions',1,2],['audit',2,2],['auditplan',3,2]
  ],
  links:[['board','scope'],['scope','roles'],['roles','standards'],['standards','passwords'],['passwords','backup'],['backup','usage'],['usage','incident'],['incident','train'],['train','exceptions'],['exceptions','audit'],['audit','auditplan']]
 },
 roadmap:{
  items:[
   ['phase1',0,0],['restore',1,0],['energy',2,0],['inventory',3,0],
   ['phase2',0,1],['mfa',1,1],['psi',2,1],['monitor',3,1],
   ['phase3',0,2],['dr',1,2],['phase4',2,2],['audit',3,2]
  ],
  links:[['phase1','restore'],['restore','energy'],['energy','inventory'],['inventory','phase2'],['phase2','mfa'],['mfa','psi'],['psi','monitor'],['monitor','phase3'],['phase3','dr'],['dr','phase4'],['phase4','audit']]
 }
}

const positions={x:[72,422,772,1122],y:[100,317,534]}
export const CARD_WIDTH=226
export const CARD_HEIGHT=104

export function diagramFor(board) {
 const config=grids[board.id]
 const catalog=new Map(board.nodes.map(item=>[item.id,item]))
 const nodes=config.items.map(([id,col,row])=>({
  item:catalog.get(id),x:positions.x[col],y:positions.y[row]
 })).filter(item=>item.item)
 const validIds=new Set(nodes.map(node=>node.item.id))
 return {nodes,links:config.links.filter(([from,to])=>validIds.has(from)&&validIds.has(to))}
}

// Route connectors around *all* rectangular nodes, with clearance. A deterministic
// Manhattan A* is used rather than diagonal edges that cut through components.
const STEP=14
const MARGIN=20
const WIDTH=1540
const HEIGHT=770
const DIRECTIONS=[[1,0],[-1,0],[0,1],[0,-1]]
const key=(x,y)=>x+','+y
const roundGrid=value=>Math.round(value/STEP)
const fromGrid=value=>value*STEP
const heuristic=(x,y,tx,ty)=>Math.abs(x-tx)+Math.abs(y-ty)

function port(node,side){
 switch(side){
  case 'left':return {x:node.x,y:node.y+CARD_HEIGHT/2,dx:-1,dy:0}
  case 'right':return {x:node.x+CARD_WIDTH,y:node.y+CARD_HEIGHT/2,dx:1,dy:0}
  case 'top':return {x:node.x+CARD_WIDTH/2,y:node.y,dx:0,dy:-1}
  default:return {x:node.x+CARD_WIDTH/2,y:node.y+CARD_HEIGHT,dx:0,dy:1}
 }
}

function sidePair(a,b){
 const ax=a.x+CARD_WIDTH/2,ay=a.y+CARD_HEIGHT/2
 const bx=b.x+CARD_WIDTH/2,by=b.y+CARD_HEIGHT/2
 const dx=bx-ax,dy=by-ay
 if(Math.abs(dx)>Math.abs(dy)*.9)return dx>=0?['right','left']:['left','right']
 return dy>=0?['bottom','top']:['top','bottom']
}

function pathFind(start,end,obstacles){
 const sx=roundGrid(start.x),sy=roundGrid(start.y)
 const tx=roundGrid(end.x),ty=roundGrid(end.y)
 const limitX=roundGrid(WIDTH),limitY=roundGrid(HEIGHT)
 const blocked=(x,y)=>{
  const px=fromGrid(x),py=fromGrid(y)
  if(x<0||y<0||x>limitX||y>limitY)return true
  return obstacles.some(o=>px>=o.x-MARGIN&&px<=o.x+CARD_WIDTH+MARGIN&&py>=o.y-MARGIN&&py<=o.y+CARD_HEIGHT+MARGIN)
 }
 let open=[{x:sx,y:sy,d:4,g:0,f:heuristic(sx,sy,tx,ty)}]
 const visited=new Map(),best=new Map([[key(sx,sy)+',4',0]])
 let destination=null
 let tries=0
 while(open.length&&tries++<45000){
  open.sort((a,b)=>b.f-a.f)
  const node=open.pop()
  const state=key(node.x,node.y)+','+node.d
  if(visited.has(state))continue
  visited.set(state,node)
  if(Math.abs(node.x-tx)<=1&&Math.abs(node.y-ty)<=1){destination=node;break}
  for(let i=0;i<4;i++){
   const [dx,dy]=DIRECTIONS[i],nx=node.x+dx,ny=node.y+dy
   if(blocked(nx,ny)&&!(Math.abs(nx-tx)<=1&&Math.abs(ny-ty)<=1))continue
   const g=node.g+1+(node.d!==4&&node.d!==i?5:0)
   const nk=key(nx,ny)+','+i
   if((best.get(nk)??Infinity)<=g)continue
   best.set(nk,g)
   open.push({x:nx,y:ny,d:i,g,f:g+heuristic(nx,ny,tx,ty),parent:node})
  }
 }
 if(!destination)return null
 const points=[]
 for(let current=destination;current;current=current.parent)points.push({x:fromGrid(current.x),y:fromGrid(current.y)})
 return points.reverse()
}
function simplify(points){
 if(points.length<3)return points
 const result=[points[0]]
 for(let i=1;i<points.length-1;i++){
  const a=result[result.length-1],b=points[i],c=points[i+1]
  if((Math.abs(a.x-b.x)<.01&&Math.abs(b.x-c.x)<.01)||(Math.abs(a.y-b.y)<.01&&Math.abs(b.y-c.y)<.01))continue
  result.push(b)
 }
 result.push(points[points.length-1])
 return result
}
export function routeLinks(layout){
 const byId=new Map(layout.nodes.map(node=>[node.item.id,node]))
 return layout.links.map(([source,target,label],index)=>{
  const a=byId.get(source),b=byId.get(target)
  const [aSide,bSide]=sidePair(a,b)
  const start=port(a,aSide),end=port(b,bSide)
  const startOuter={x:start.x+start.dx*37,y:start.y+start.dy*37}
  const endOuter={x:end.x+end.dx*37,y:end.y+end.dy*37}
  const obstacles=layout.nodes.filter(node=>node!==a&&node!==b)
  const middle=pathFind(startOuter,endOuter,obstacles)
  // Same-row links can remain a simple straight segment.
  const points=simplify([{x:start.x,y:start.y},startOuter,...(middle||[]),endOuter,{x:end.x,y:end.y}])
  return {id:'edge-'+index,source,target,label:label||'',points,aSide,bSide}
 })
}
