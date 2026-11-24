// Boards intentionally show only structural elements; details are in the inspector.
// All routes use the same geometry in the "Antes" and "Depois" states.
const grids = {
 architecture: {
  items: [['users',0,0],['edge',1,0],['erp',2,0],['bi',3,0],['connectivity',0,1],['power',1,1],['database',2,1],['etl',3,1],['physical',0,2],['backup',1,2],['recovery',2,2],['immutable',3,2]],
  links: [['users','edge','acesso'],['edge','erp','pedidos'],['erp','database','transações'],['connectivity','edge','link'],['power','erp','energia'],['physical','power','suporte'],['database','backup','cópia'],['database','recovery','replicação'],['backup','immutable','off-site'],['database','etl','dados'],['etl','bi','indicadores'],['recovery','immutable','DR']]
 },
 assets:{
  items:[['inventory',0,0],['owners',1,0],['class',2,0],['dependencies',3,0],['threat',0,1],['scenarios',1,1],['bia',2,1],['matrix',3,1],['treat',0,2],['residual',1,2],['audit',2,2],['kri',3,2]],
  links:[['inventory','owners'],['owners','class'],['class','dependencies'],['dependencies','threat'],['threat','scenarios'],['scenarios','bia'],['bia','matrix'],['matrix','treat'],['residual','audit'],['audit','kri'],['treat','residual']]
 },
 identity:{
  items:[['request',0,0],['joiner',1,0],['move',2,0],['offboard',3,0],['password',0,1],['mfa',1,1],['rbac',2,1],['sod',3,1],['service',0,2],['privileged',1,2],['reviews',2,2],['logs',3,2]],
  links:[['request','joiner'],['joiner','move'],['move','offboard'],['password','mfa'],['mfa','rbac'],['rbac','sod'],['service','privileged'],['privileged','reviews'],['reviews','logs'],['joiner','mfa'],['rbac','privileged']]
 },
 restore:{
  items:[['schedule',0,0],['protect',1,0],['copies',2,0],['keys',3,0],['detect',0,1],['isolate',1,1],['source',2,1],['infra',3,1],['db',0,2],['restore',1,2],['validate',2,2],['rpor',3,2]],
  links:[['schedule','protect'],['protect','copies'],['copies','keys'],['detect','isolate'],['isolate','source'],['source','infra'],['infra','db'],['db','restore'],['restore','validate'],['validate','rpor'],['copies','source']]
 },
 lifecycle:{
  items:[['collect',0,0],['catalog',1,0],['legal',2,0],['use',3,0],['quality',0,1],['minimize',1,1],['classify',2,1],['store',3,1],['retain',0,2],['temporal',1,2],['delete',2,2],['replay',3,2]],
  links:[['collect','catalog'],['catalog','legal'],['legal','use'],['use','quality'],['quality','minimize'],['minimize','classify'],['classify','store'],['store','retain'],['retain','temporal'],['temporal','delete'],['delete','replay']]
 },
 policy:{
  items:[['board',0,0],['scope',1,0],['roles',2,0],['standards',3,0],['passwords',0,1],['backup',1,1],['usage',2,1],['incident',3,1],['train',0,2],['exceptions',1,2],['audit',2,2],['auditplan',3,2]],
  links:[['board','scope'],['scope','roles'],['roles','standards'],['standards','passwords'],['passwords','backup'],['backup','usage'],['usage','incident'],['incident','train'],['train','exceptions'],['exceptions','audit'],['audit','auditplan']]
 },
 roadmap:{
  items:[['phase1',0,0],['restore',1,0],['energy',2,0],['inventory',3,0],['phase2',0,1],['mfa',1,1],['psi',2,1],['monitor',3,1],['phase3',0,2],['dr',1,2],['phase4',2,2],['audit',3,2]],
  links:[['phase1','restore'],['restore','energy'],['energy','inventory'],['inventory','phase2'],['phase2','mfa'],['mfa','psi'],['psi','monitor'],['monitor','phase3'],['phase3','dr'],['dr','phase4'],['phase4','audit']]
 }
}

const positions={x:[72,422,772,1122],y:[100,317,534]}
export const CARD_WIDTH=226
export const CARD_HEIGHT=104

export function diagramFor(board){
 const config=grids[board.id]
 const catalog=new Map(board.nodes.map(item=>[item.id,item]))
 const nodes=config.items.map(([id,col,row])=>({item:catalog.get(id),x:positions.x[col],y:positions.y[row]})).filter(node=>node.item)
 const available=new Set(nodes.map(node=>node.item.id))
 return {nodes,links:config.links.filter(([source,target])=>available.has(source)&&available.has(target))}
}

const CLEARANCE=17
const EXIT=34
const TURN_PENALTY=48
const DIRECTIONS=[[1,0],[-1,0],[0,1],[0,-1]]
const equal=(a,b)=>Math.abs(a-b)<.01
const pointEqual=(a,b)=>equal(a.x,b.x)&&equal(a.y,b.y)
const vertex=(x,y)=>({x,y})
const center=node=>({x:node.x+CARD_WIDTH/2,y:node.y+CARD_HEIGHT/2})
const inside=(p,box)=>p.x>box.x-CLEARANCE&&p.x<box.x+CARD_WIDTH+CLEARANCE&&p.y>box.y-CLEARANCE&&p.y<box.y+CARD_HEIGHT+CLEARANCE
const boundary=(node,side)=>{
 const c=center(node)
 if(side==='left')return {x:node.x,y:c.y,dx:-1,dy:0}
 if(side==='right')return {x:node.x+CARD_WIDTH,y:c.y,dx:1,dy:0}
 if(side==='top')return {x:c.x,y:node.y,dx:0,dy:-1}
 return {x:c.x,y:node.y+CARD_HEIGHT,dx:0,dy:1}
}
function sidePair(source,target){
 const a=center(source),b=center(target),dx=b.x-a.x,dy=b.y-a.y
 if(Math.abs(dx)>Math.abs(dy)*.82)return dx>0?['right','left']:['left','right']
 return dy>0?['bottom','top']:['top','bottom']
}
function clearSegment(a,b,obstacles){
 if(!equal(a.x,b.x)&&!equal(a.y,b.y))return false
 return !obstacles.some(box=>{
  if(equal(a.y,b.y))return a.y>box.y-CLEARANCE&&a.y<box.y+CARD_HEIGHT+CLEARANCE&&Math.max(a.x,b.x)>box.x-CLEARANCE&&Math.min(a.x,b.x)<box.x+CARD_WIDTH+CLEARANCE
  return a.x>box.x-CLEARANCE&&a.x<box.x+CARD_WIDTH+CLEARANCE&&Math.max(a.y,b.y)>box.y-CLEARANCE&&Math.min(a.y,b.y)<box.y+CARD_HEIGHT+CLEARANCE
 })
}
const unique=arr=>[...new Set(arr)].sort((a,b)=>a-b)
const k=(xi,yi,dir)=>xi+':'+yi+':'+dir
function findOrthogonalRoute(start,end,boxes,occupied){
 // Prefer a direct corridor or a single right-angle bend: consistent with the
 // clean reference diagram, and avoids detours produced by graph search.
 if(clearSegment(start,end,boxes))return [start,end]
 for(const corner of [vertex(start.x,end.y),vertex(end.x,start.y)]){
  if(clearSegment(start,corner,boxes)&&clearSegment(corner,end,boxes))return [start,corner,end]
 }
 // Visibility graph: every junction and every start/end coordinate is exact.
 // Unlike rounded grid A*, it cannot introduce diagonal joins or short zigzags.
 const xs=unique([12,45,1490,start.x,end.x,...boxes.flatMap(b=>[b.x-CLEARANCE-10,b.x+CARD_WIDTH+CLEARANCE+10,b.x+CARD_WIDTH/2])])
 const ys=unique([12,45,765,start.y,end.y,...boxes.flatMap(b=>[b.y-CLEARANCE-10,b.y+CARD_HEIGHT+CLEARANCE+10,b.y+CARD_HEIGHT/2])])
 const sx=xs.indexOf(start.x),sy=ys.indexOf(start.y),tx=xs.indexOf(end.x),ty=ys.indexOf(end.y)
 const queue=[{x:sx,y:sy,dir:-1,g:0,f:Math.abs(start.x-end.x)+Math.abs(start.y-end.y),parent:null}]
 const best=new Map([[k(sx,sy,-1),0]])
 let answer=null
 // Small (usually <25 x 25) graph; deterministic tie-breaks prefer fewer bends.
 for(let runs=0;queue.length&&runs<25000;runs++){
  queue.sort((a,b)=>b.f-a.f||b.g-a.g)
  const here=queue.pop()
  if(here.g>best.get(k(here.x,here.y,here.dir))+.001)continue
  if(here.x===tx&&here.y===ty){answer=here;break}
  for(let d=0;d<4;d++){
   const nx=here.x+DIRECTIONS[d][0],ny=here.y+DIRECTIONS[d][1]
   if(nx<0||ny<0||nx>=xs.length||ny>=ys.length)continue
   const p=vertex(xs[here.x],ys[here.y]),q=vertex(xs[nx],ys[ny])
   if(!clearSegment(p,q,boxes))continue
   const length=Math.abs(p.x-q.x)+Math.abs(p.y-q.y)
   const orientation=d<2?'h':'v'
   const segmentKey=orientation+':'+(orientation==='h'?p.y:p.x)+':'+(orientation==='h'?Math.min(p.x,q.x):Math.min(p.y,q.y))
   const congestion=occupied.get(segmentKey)||0
   const cost=here.g+length+(here.dir!==-1&&here.dir!==d?TURN_PENALTY:0)+congestion*18
   const state=k(nx,ny,d)
   if(cost>=(best.get(state)??Infinity))continue
   best.set(state,cost)
   queue.push({x:nx,y:ny,dir:d,g:cost,f:cost+Math.abs(xs[nx]-end.x)+Math.abs(ys[ny]-end.y),parent:here,segmentKey})
  }
 }
 if(!answer)return null
 const route=[]
 for(let cursor=answer;cursor;cursor=cursor.parent){
  route.push(vertex(xs[cursor.x],ys[cursor.y]))
  if(cursor.segmentKey)occupied.set(cursor.segmentKey,(occupied.get(cursor.segmentKey)||0)+1)
 }
 return route.reverse()
}
function simplify(points){
 const output=[]
 for(const p of points){
  if(output.length&&pointEqual(output[output.length-1],p))continue
  while(output.length>=2){
   const a=output[output.length-2],b=output[output.length-1]
   if((equal(a.x,b.x)&&equal(b.x,p.x))||(equal(a.y,b.y)&&equal(b.y,p.y)))output.pop()
   else break
  }
  output.push(p)
 }
 return output
}
export function pathIsOrthogonal(points){
 return points.every((point,i)=>!i||equal(point.x,points[i-1].x)||equal(point.y,points[i-1].y))
}
export function routeLinks(layout){
 const nodes=new Map(layout.nodes.map(node=>[node.item.id,node]))
 const occupied=new Map()
 return layout.links.map(([source,target,label],index)=>{
  const a=nodes.get(source),b=nodes.get(target)
  const [sourceSide,targetSide]=sidePair(a,b)
  const sp=boundary(a,sourceSide),tp=boundary(b,targetSide)
  const start=vertex(sp.x,sp.y),end=vertex(tp.x,tp.y)
  const away=vertex(sp.x+sp.dx*EXIT,sp.y+sp.dy*EXIT)
  const arrive=vertex(tp.x+tp.dx*EXIT,tp.y+tp.dy*EXIT)
  const boxes=layout.nodes // include both endpoints; outside anchors stay outside padded obstacles
  const route=findOrthogonalRoute(away,arrive,boxes,occupied)
  if(!route)throw new Error('Não foi possível rotear '+source+' → '+target)
  const points=simplify([start,away,...route,arrive,end])
  if(!pathIsOrthogonal(points))throw new Error('Conexão não ortogonal: '+source+' → '+target)
  return {id:'edge-'+index,source,target,label:label||'',points,sourceSide,targetSide}
 })
}
