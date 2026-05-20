// Per-city content for /collision-repair/[city] landing pages.
// Keep each blurb unique and locally specific (street names, neighborhoods,
// landmarks) to avoid thin/duplicate-content penalties.

export interface ServiceCity {
  slug: string
  name: string
  fullName: string
  zip: string
  milesAway: number
  direction: string
  blurb: string
  landmarks: string[]
  testimonial: { text: string; author: string }
}

export const SERVICE_CITIES: ServiceCity[] = [
  {
    slug: 'suwanee',
    name: 'Suwanee',
    fullName: 'Suwanee, GA',
    zip: '30024',
    milesAway: 6,
    direction: 'north',
    blurb:
      'A straight shot south on Buford Highway from Suwanee Town Center puts Taylor\'s Collision about ten minutes from your driveway. We see drivers from Olde Town Suwanee, Sims Lake Park, and the Highway 23 corridor every week — fender-benders from the I-85 ramps to deer strikes on the back roads near Bears Best.',
    landmarks: ['Suwanee Town Center', 'Olde Town Suwanee', 'Sims Lake Park', 'Bears Best Atlanta'],
    testimonial: {
      text: 'Drove down from Suwanee after a rear-end on I-85. Max had a written estimate in 20 minutes and the car back in nine days. Lifetime warranty is the real deal.',
      author: 'Aaron P.',
    },
  },
  {
    slug: 'johns-creek',
    name: 'Johns Creek',
    fullName: 'Johns Creek, GA',
    zip: '30097',
    milesAway: 5,
    direction: 'south',
    blurb:
      'Johns Creek drivers cross over to us via McGinnis Ferry or Medlock Bridge in about ten minutes. Whether it\'s a parking-lot scrape at Avalon, hail damage in the Newtown neighborhoods, or a deer strike on State Bridge Road, we\'ve repaired it — usually with direct billing to State Farm, Allstate, or Geico so you don\'t front the deductible.',
    landmarks: ['Avalon', 'Newtown Park', 'McGinnis Ferry Rd', 'Medlock Bridge'],
    testimonial: {
      text: 'Three other shops told me my Lexus was a write-off. Taylor\'s rebuilt the quarter panel and matched the pearl white perfectly. I\'ll drive past every other shop in Johns Creek to come here again.',
      author: 'Priya S.',
    },
  },
  {
    slug: 'norcross',
    name: 'Norcross',
    fullName: 'Norcross, GA',
    zip: '30093',
    milesAway: 6,
    direction: 'south',
    blurb:
      'Norcross is one of our shortest tow routes — straight up Buford Highway from Historic Norcross or Indian Trail. We handle a steady flow of damage from the I-85 / 285 interchange, the Jimmy Carter Boulevard surface streets, and the warehouse district near Atlanta Tech Park. Free pickup from anywhere inside the 30093 / 30071 ZIPs.',
    landmarks: ['Historic Norcross', 'Lillian Webb Park', 'Atlanta Tech Park', 'Jimmy Carter Blvd'],
    testimonial: {
      text: 'Got rear-ended on Indian Trail. They sent a tow within an hour and dealt with Progressive entirely. Picked up the car looking better than the day I bought it.',
      author: 'Daniel K.',
    },
  },
  {
    slug: 'lawrenceville',
    name: 'Lawrenceville',
    fullName: 'Lawrenceville, GA',
    zip: '30043',
    milesAway: 8,
    direction: 'east',
    blurb:
      'Lawrenceville customers reach us in fifteen minutes via Buford Drive or Sugarloaf Parkway. We see the full mix of damage that comes out of Gwinnett County — Mall of Georgia parking lot dings, deer strikes on Highway 316, and serious collisions from the Lawrenceville-Suwanee Road corridor. OEM parts on every structural repair, in writing.',
    landmarks: ['Lawrenceville Square', 'Coolray Field', 'Gwinnett Justice Center', 'Sugarloaf Pkwy'],
    testimonial: {
      text: 'Dealer wanted three weeks just to start. Taylor\'s had me back on the road in eight days, same OEM parts, half the headache.',
      author: 'Marcus L.',
    },
  },
  {
    slug: 'sugar-hill',
    name: 'Sugar Hill',
    fullName: 'Sugar Hill, GA',
    zip: '30518',
    milesAway: 10,
    direction: 'north',
    blurb:
      'From Sugar Hill it\'s a fifteen-minute drive south down Peachtree Industrial Boulevard or Highway 20. The downtown E Center neighborhoods, Buford Dam Road, and the I-985 access roads all funnel through our shop — collision repair, bumper work, and full-vehicle repaints with PPG paint systems matched to the factory color code.',
    landmarks: ['E Center', 'Sugar Hill Golf Club', 'Buford Dam Rd', 'Peachtree Industrial Blvd'],
    testimonial: {
      text: 'Hailstorm dented twelve panels. Taylor\'s did paintless repair on most of it, repainted the hood, and my insurance covered everything. They\'re who I tell every neighbor in Sugar Hill to call.',
      author: 'Jenna T.',
    },
  },
  {
    slug: 'peachtree-corners',
    name: 'Peachtree Corners',
    fullName: 'Peachtree Corners, GA',
    zip: '30092',
    milesAway: 5,
    direction: 'south',
    blurb:
      'Peachtree Corners is one of our closest service areas — about ten minutes via Peachtree Parkway or Holcomb Bridge. Town Center commuters, the Tech Park corridor, and the Spalding Drive neighborhoods all bring us steady work. Free written estimates same-day, no obligation, no upsell.',
    landmarks: ['The Forum at Peachtree Corners', 'Town Center', 'Curiosity Lab', 'Holcomb Bridge Rd'],
    testimonial: {
      text: 'Backed into a bollard at The Forum. Quick estimate, two-day turnaround, and they Uber\'d me home while they worked. Effortless.',
      author: 'Sara M.',
    },
  },
]
