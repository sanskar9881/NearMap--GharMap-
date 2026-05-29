export function formatPrice(price:number,type='rent'):string{
  if(type==='buy'){if(price>=10000000)return`₹${(price/10000000).toFixed(1)}Cr`;return`₹${(price/100000).toFixed(0)}L`;}
  if(price>=1000)return`₹${(price/1000).toFixed(0)}K/mo`;
  return`₹${price}/mo`;
}
