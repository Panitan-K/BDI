
export const project1Data = {
    name: "Project 1: Eastern EEC High-Speed Rail",
    name_th: "โปรเจกต์ 1: รถไฟความเร็วสูง EEC ตะวันออก",
    gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 3 + 1 })),
    freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 20 + 10 })),
    jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', value: 4500 }, { name: 'Logistics', name_th: 'โลจิสติกส์', value: 2700 }, { name: 'Services', name_th: 'บริการ', value: 3200 }, { name: 'Manufacturing', name_th: 'การผลิต', value: 1800 } ],
    regionalData: [ { name: 'North', name_th: 'เหนือ', value: 400, fill: 'hsl(var(--chart-1))' }, { name: 'East', name_th: 'ตะวันออก', value: 300, fill: 'hsl(var(--chart-2))' }, { name: 'South', name_th: 'ใต้', value: 300, fill: 'hsl(var(--chart-3))' }, { name: 'West', name_th: 'ตะวันตก', value: 200, fill: 'hsl(var(--chart-4))' } ],
    economicImpact: 2.8, logisticFlow: 15, environmentalScore: 72, investmentSuitability: 79, landPriceTrend: 2.1, businessReg: 425, skilledLabor: 38.2,
    funding: {
      totalCost: 150, // B THB
      roi: 12.5,
      paybackPeriod: 8,
      sources: [
        { name: 'Government', name_th: 'ภาครัฐ', value: 60, fill: 'hsl(var(--chart-1))' },
        { name: 'Private', name_th: 'เอกชน', value: 40, fill: 'hsl(var(--chart-2))' }
      ]
    },
    socioEconomic: {
      povertyReduction: 1.5,
      householdIncome: 3.2,
      disparityData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: 10 - i * (0.5 + Math.random()*0.2) })),
    }
  };

export const project2Data = {
    name: "Project 2: Southern Land Bridge",
    name_th: "โปรเจกต์ 2: สะพานเศรษฐกิจภาคใต้",
    gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 2 + 0.5 })),
    freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 15 + 5 })),
    jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', value: 2200 }, { name: 'Logistics', name_th: 'โลจิสติกส์', value: 5100 }, { name: 'Services', name_th: 'บริการ', value: 1800 }, { name: 'Manufacturing', name_th: 'การผลิต', value: 4200 } ],
    regionalData: [ { name: 'North', name_th: 'เหนือ', value: 150, fill: 'hsl(var(--chart-1))' }, { name: 'East', name_th: 'ตะวันออก', value: 550, fill: 'hsl(var(--chart-2))' }, { name: 'South', name_th: 'ใต้', value: 200, fill: 'hsl(var(--chart-3))' }, { name: 'West', name_th: 'ตะวันตก', value: 100, fill: 'hsl(var(--chart-4))' } ],
    economicImpact: 1.2, logisticFlow: 8, environmentalScore: 85, investmentSuitability: 68, landPriceTrend: 1.3, businessReg: 210, skilledLabor: 25.6,
    funding: {
      totalCost: 350,
      roi: 9.8,
      paybackPeriod: 12,
      sources: [
        { name: 'Government', name_th: 'ภาครัฐ', value: 45, fill: 'hsl(var(--chart-1))' },
        { name: 'Private', name_th: 'เอกชน', value: 55, fill: 'hsl(var(--chart-2))' }
      ]
    },
    socioEconomic: {
      povertyReduction: 2.1,
      householdIncome: 4.5,
      disparityData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: 12 - i * (0.6 + Math.random()*0.2) })),
    }
  };

export const comparisonData = {
    name: "Comparison: P1 vs P2",
    name_th: "เปรียบเทียบ: P1 vs P2",
    gdpData: project1Data.gdpData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.gdpData[i].v})),
    freightData: project1Data.freightData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.freightData[i].v})),
    jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', p1: 4500, p2: 2200 }, { name: 'Logistics', name_th: 'โลจิสติกส์', p1: 2700, p2: 5100 }, { name: 'Services', name_th: 'บริการ', p1: 3200, p2: 1800 }, { name: 'Manufacturing', name_th: 'การผลิต', p1: 1800, p2: 4200 } ],
    regionalData: project1Data.regionalData.map((d, i) => ({ name: d.name, name_th: d.name_th, p1: d.value, p2: project2Data.regionalData[i].value, fill: d.fill })),
    economicImpact: { p1: 2.8, p2: 1.2 }, logisticFlow: { p1: 15, p2: 8 }, environmentalScore: { p1: 72, p2: 85 }, investmentSuitability: { p1: 79, p2: 68 }, landPriceTrend: { p1: 2.1, p2: 1.3 }, businessReg: { p1: 425, p2: 210 }, skilledLabor: { p1: 38.2, p2: 25.6 },
    funding: {
      totalCost: {p1: 150, p2: 350},
      roi: {p1: 12.5, p2: 9.8},
      paybackPeriod: {p1: 8, p2: 12},
      sources: { p1: { gov: 60, priv: 40 }, p2: { gov: 45, priv: 55 } },
    },
    socioEconomic: {
        povertyReduction: {p1: 1.5, p2: 2.1},
        householdIncome: {p1: 3.2, p2: 4.5},
        disparityData: project1Data.socioEconomic.disparityData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.socioEconomic.disparityData[i].v})),
    }
  };

export const regionalMockData: Record<string, any> = {
      'Khon Kaen': { ...project1Data, name: 'Khon Kaen LRT Analysis', name_th: 'การวิเคราะห์ LRT ขอนแก่น', economicImpact: 3.4, environmentalScore: 74, investmentSuitability: 83 },
      'Bangkok': { ...project1Data, name: 'Bangkok Analysis', name_th: 'การวิเคราะห์กรุงเทพมหานคร', economicImpact: 5.1, environmentalScore: 55, investmentSuitability: 92 },
      'Chiang Mai': { ...project2Data, name: 'Chiang Mai Analysis', name_th: 'การวิเคราะห์เชียงใหม่', economicImpact: 1.8, environmentalScore: 88, investmentSuitability: 75 },
      'Phuket': { ...project1Data, name: 'Phuket Analysis', name_th: 'การวิเคราะห์ภูเก็ต', economicImpact: 3.5, environmentalScore: 78, investmentSuitability: 85 },
      'Chon Buri': { ...project2Data, name: 'Chon Buri Analysis', name_th: 'การวิเคราะห์ชลบุรี', economicImpact: 4.2, environmentalScore: 65, investmentSuitability: 89 }
  };
  
export const popoverDetailData = {
    project1: {
      economicImpact: {
        title: 'Detailed Economic Outlook',
        sections: [
          { heading: 'Overall Projection', text: 'This project is forecast to contribute a sustained +2.8% to the regional GDP over the next decade.' },
          { heading: 'Sector-Specific Growth', list: ['Tourism & Hospitality: +4.5%', 'Trade & Logistics: +3.2%', 'Industrial & Manufacturing: +2.5%', 'Real Estate & Commercial: +1.8%'] },
          { heading: 'Economic Multiplier Effect', text: 'For every ฿1 billion invested, an additional ฿1.8 billion in economic activity is expected to be generated in related industries.' },
          { heading: 'Methodology', text: 'The forecast is based on a Computable General Equilibrium (CGE) model, analyzing the impact of reduced travel times, increased freight capacity, and enhanced labor market access.' },
        ],
      },
      logisticFlow: {
        title: 'Enhanced Freight & Transit Capabilities',
        sections: [
          { heading: 'Increased Capacity', text: "The high-speed rail will handle an additional 4.5 million tons of freight annually, marking a +15% increase in the region's total freight volume." },
          { heading: 'Time Savings', timeSavings: [ { location: 'Bangkok to Rayong', detail: 'Transit time for goods will be reduced from 4-6 hours by truck to just 90 minutes by rail.' }, { location: 'Laem Chabang Port to Industrial Estates', detail: 'Connectivity will be reduced to under 60 minutes.' } ] },
          { heading: 'Key Commodities', text: 'Primary goods expected to shift to rail include agricultural products (fruits, rubber), automotive parts, electronics, and consumer goods.' },
          { heading: 'Cost Efficiency', text: 'Shifting to rail is projected to reduce logistics costs by 12-18% compared to road transport, enhancing the competitiveness of Thai exports.' },
        ],
      },
      environmentalScore: {
          title: 'Environmental Impact Analysis',
          sections: [
            { heading: 'Overall Score: 72/100', text: 'This score reflects a strong commitment to sustainability, balanced against the unavoidable impacts of large-scale construction. The project has received full approval from the Environmental Impact Assessment (EIA) board.' },
            { heading: 'Scoring Breakdown', list: ['Carbon Emissions Reduction: +85/100', 'Land Use Impact: -55/100', 'Noise & Vibration: 70/100', 'Biodiversity Protection: +78/100'] },
          ],
      },
      investmentSuitability: {
          title: 'Investment Profile & Risk Assessment',
          sections: [
            { heading: 'Overall Score: 79/100', text: 'Indicates a highly favorable investment climate, supported by strong government backing and robust economic fundamentals.' },
            { heading: 'Scoring Breakdown', list: ['Political & Regulatory Stability: 88/100', 'Market Demand: 82/100', 'Financial Viability: 75/100', 'Risk Mitigation: 71/100'] },
          ],
      },
      jobsCreated: {
          title: 'Employment Generation Details',
          sections: [
            { heading: 'Total Jobs: 12,200', text: 'This project will create a significant number of both temporary and permanent jobs across various sectors.' },
            { heading: 'Job Breakdown', list: ['Construction: 4,500 jobs', 'Services: 3,200 jobs', 'Logistics: 2,700 jobs', 'Manufacturing: 1,800 jobs'] },
          ],
      },
      regionalDistribution: {
          title: 'Allocation of Resources & Benefits',
          sections: [
              { heading: 'Objective', text: 'To ensure equitable growth and connect economic hubs with developing areas.' },
              { heading: 'Benefit Distribution', list: ['South: 40%', 'East: 30%', 'North: 15%', 'West: 15%'] },
          ],
      },
      financing: {
          title: 'Detailed Financial Structure',
          sections: [
            { heading: 'Total Cost: ฿150 Billion', list: ['Civil Works & Construction: ฿75B (50%)', 'Rolling Stock (Trains): ฿30B (20%)', 'Signaling & Electrification: ฿22.5B (15%)', 'Land Acquisition: ฿15B (10%)', 'Contingency: ฿7.5B (5%)'] },
            { heading: 'Funding Model', text: 'Government (60% - ฿90B) and Private (40% - ฿60B) via a Public-Private Partnership (PPP) Net Cost model.' },
            { heading: 'Financial Metrics', list: ['Return on Investment (ROI): 12.5%', 'Payback Period: 8 Years'] },
          ],
      },
      socioEconomic: {
          title: 'Community & Social Development',
          sections: [
            { heading: 'Objective', text: 'To improve quality of life and reduce inequality across the Eastern Economic Corridor.' },
            { heading: 'Impact Metrics', list: ['Household Income: +3.2%', 'Poverty Reduction: +1.5%', 'Regional Disparity: Decreasing'] },
          ],
      },
      predictive: {
          title: 'Predictive Analytics & Future Trends',
          sections: [
            { heading: 'Land Price Trend (+2.1% Annually)', text: 'Land values within a 5km radius of new stations are projected to increase. Areas around major interchanges may see appreciation as high as 4-5% annually.' },
            { heading: 'New Business Registrations (425 Annually)', text: 'An average of 425 new businesses are expected to be registered annually in the three years following the line\'s opening.' },
            { heading: 'Skilled Labor Demand (38.2k)', text: 'A projected demand for 38,200 skilled workers will be created over the project\'s first decade.' },
          ],
      }
    },
    project2: {
      economicImpact: {
          title: 'Detailed Economic Outlook (P2)',
          sections: [
            { heading: 'Overall Projection', text: 'This project is forecast to contribute a sustained +1.2% to the regional GDP over the next decade.' },
          ],
        },
        logisticFlow: {
          title: 'Enhanced Freight & Transit Capabilities (P2)',
          sections: [
            { heading: 'Increased Capacity', text: "The land bridge will handle an additional 8 million tons of freight annually, marking a +8% increase in the region's total freight volume." },
            { heading: 'Time Savings', timeSavings: [ { location: 'Gulf of Thailand to Andaman Sea', detail: 'Maritime transit time reduced from 2-3 days (via Strait of Malacca) to under 12 hours via the land bridge.' } ] },
          ],
        },
        environmentalScore: {
          title: 'Environmental Impact Analysis (P2)',
          sections: [
              { heading: 'Overall Score: 85/100', text: 'This high score reflects a focus on marine and coastal ecosystem preservation.' },
          ],
      },
      investmentSuitability: {
          title: 'Investment Profile & Risk Assessment (P2)',
          sections: [
              { heading: 'Overall Score: 68/100', text: 'A moderate investment profile, reflecting higher construction complexity but significant long-term strategic value.' },
          ],
      },
      jobsCreated: {
          title: 'Employment Generation Details (P2)',
          sections: [
            { heading: 'Total Jobs: 13,300', text: 'This project will create a significant number of both temporary and permanent jobs across various sectors.' },
          ],
      },
      regionalDistribution: {
          title: 'Allocation of Resources & Benefits (P2)',
          sections: [
              { heading: 'Objective', text: 'To create a new strategic trade route bypassing the Strait of Malacca.' },
          ],
      },
      financing: {
          title: 'Detailed Financial Structure (P2)',
          sections: [
            { heading: 'Total Cost: ฿350 Billion', list: ['Port Construction: ฿150B (43%)', 'Land Infrastructure: ฿100B (28%)', 'Contingency & Other: ฿100B (29%)'] },
          ],
      },
      socioEconomic: {
          title: 'Community & Social Development (P2)',
          sections: [
            { heading: 'Objective', text: 'To energize the economy of southern provinces.' },
          ],
      },
      predictive: {
          title: 'Predictive Analytics & Future Trends (P2)',
          sections: [
            { heading: 'Land Price Trend (+1.3% Annually)', text: 'Moderate land value increase expected.' },
          ],
      }
    }
  };

export const comparisonPopoverDetailData = {
      economicImpact: {
          title: 'Comparative Economic Forecast',
          sections: [
              { heading: 'Overview', text: 'This comparison shows two different approaches to economic stimulation. Project 1 focuses on high-intensity industrial growth, while Project 2 emphasizes broader, community-level economic uplift.' },
              { heading: 'Project 1: EEC High-Speed Rail (GDP Forecast: +2.8%)', text: 'Strategy: Maximizes economic impact by connecting major industrial estates, deep-sea ports, and airports. This high-speed, high-capacity link is designed to supercharge the core industrial economy.\n\nDriver: Primarily driven by massive gains in industrial logistics, export efficiency, and high-value business travel.' },
              { heading: 'Project 2: Green Community Rail (GDP Forecast: +1.2%)', text: 'Strategy: Focuses on connecting smaller towns and agricultural centers to the main economic corridors. The impact is less intense but more widely distributed.\n\nDriver: Growth is driven by empowering small and medium-sized enterprises (SMEs), reducing transport costs for communities, and stimulating local tourism.' }
          ]
      },
      logisticFlow: {
          title: 'Freight Strategy Comparison',
          sections: [
              { heading: 'Overview', text: 'This comparison shows two different approaches to freight strategy.' },
              { heading: 'Project 1: EEC High-Speed Rail (Freight Volume: +15%)', text: 'Focus: Heavy freight and time-sensitive industrial goods. Designed for maximum throughput between major manufacturing hubs and international ports like Laem Chabang.\n\nAdvantage: Unlocks significant capacity for the export sector.' },
              { heading: 'Project 2: Green Community Rail (Freight Volume: +8%)', text: 'Focus: Light-to-medium freight, including agricultural products, consumer goods, and parcel delivery. It serves as a feeder network for communities.\n\nAdvantage: Reduces road congestion in provincial areas and provides reliable market access for local producers.' },
          ]
      },
      environmentalScore: {
          title: 'Comparative Environmental Approach',
          sections: [
              { heading: 'Project 1: Score 72', text: 'Profile: A strong score for a major industrial infrastructure project. While it significantly reduces CO₂ by shifting freight from road to rail, its score is impacted by the scale of construction and land use in a dense economic corridor.\n\nMitigation: Focuses on noise barriers, modern emission standards, and EIA-approved offsets.' },
              { heading: 'Project 2: Score 85', text: 'Profile: An exceptional score reflecting a core focus on sustainability. This project likely utilizes a less disruptive route and incorporates next-generation green technology.\n\nMitigation: May employ hydrogen or battery-electric trains, feature stations with green building certifications, and prioritize elevated tracks to minimize habitat disruption, justifying its higher cost.' },
          ]
      },
      investmentSuitability: {
          title: 'Investor Profile Analysis',
          sections: [
              { heading: 'Project 1: Score 79', text: 'Appeal: Highly suitable for traditional infrastructure investors seeking strong, predictable returns based on proven demand from industrial and passenger traffic. Lower risk profile due to clear economic drivers.\n\nModel: Backed by high-volume commercial activity.' },
              { heading: 'Project 2: Score 68', text: 'Appeal: More suitable for ESG (Environmental, Social, and Governance) investors and development funds. The lower suitability score reflects a longer payback period and less certain commercial revenue.\n\nModel: Relies on a value proposition of long-term social and environmental benefits, attracting a different class of private partners who may have access to green financing.' },
          ]
      },
      jobsCreated: {
          title: 'Employment Generation Strategy',
          sections: [
              { heading: 'Project 1: EEC High-Speed Rail', text: 'Pattern: Peaks in Construction and Logistics. This reflects a massive initial build-out phase followed by jobs centered on operating a high-capacity freight and passenger system.\n\nType: Creates a high concentration of jobs in specific industrial and transport hubs.' },
              { heading: 'Project 2: Green Community Rail', text: 'Pattern: Job creation is lower in construction but more sustained across Services and Manufacturing. This indicates a focus on long-term, community-embedded employment.\n\nType: Fosters a wider distribution of jobs in local tourism, retail at numerous smaller stations, and SME manufacturing.' },
          ]
      },
      regionalDistribution: {
          title: 'Comparative Regional Impact',
          sections: [
              { heading: 'Project 1: EEC High-Speed Rail', text: 'Curve: Shows a sharp peak in the East and South, aligning directly with the primary industrial zones and tourist centers (Rayong, Chonburi, Pattaya). It is a strategy of concentrated power.\n\nGoal: To amplify the strength of existing economic centers.' },
              { heading: 'Project 2: Green Community Rail', text: 'Curve: Shows a flatter, more distributed curve. While still serving the East, it provides more equitable benefits to the North and West, suggesting it connects outlying towns.\n\nGoal: To reduce regional disparity by spreading infrastructure benefits more broadly.' },
          ]
      },
      financing: {
          title: 'Comparative Financial Breakdown',
          sections: [
              { heading: 'Total Cost', text: 'P1 (฿150B): Cost-efficient design focused on a primary high-speed corridor.\nP2 (฿250B): Higher cost is likely due to advanced green technology (e.g., hydrogen fuel cell maintenance), a wider network with more stations, and potentially more complex land acquisition across varied terrain.' },
              { heading: 'Return & Payback', text: 'P1 (12.5% ROI, 8yr Payback): Higher ROI and faster payback driven by high-revenue industrial freight and premium passenger fares. A more attractive proposition for private investors.\nP2 (9.8% ROI, 12yr Payback): Lower financial ROI reflects a focus on social benefits over pure profit. The longer payback period is typical for projects with a strong public service component.' },
              { heading: 'Funding Mix', text: 'P1 (60% Gov / 40% Private): A standard PPP model where the government takes a majority stake to steer a project of national strategic importance.\nP2 (45% Gov / 55% Private): The higher private share, despite lower ROI, suggests specialized funding from green investment funds or partners who are incentivized by the project\'s high ESG score and long-term, stable returns.' },
          ]
      },
      socioEconomic: {
          title: 'Social Benefit Analysis',
          sections: [
              { heading: 'Overview', text: 'This metric reveals the core philosophy of each project.' },
              { heading: 'Poverty Reduction & Household Income', text: 'P1 (+1.5% Poverty Reduction, +3.2% Income): Delivers solid social benefits as a secondary effect of large-scale industrial growth.\nP2 (+2.1% Poverty Reduction, +4.5% Income): Delivers superior social outcomes as a primary goal. By directly connecting less-developed communities, it provides more impactful access to jobs, markets, and services, leading to a greater increase in household income and a stronger reduction in poverty.' },
              { heading: 'Regional Disparity', text: 'Both projects aim to reduce regional disparity, but P2\'s flatter distribution of infrastructure suggests it would be more effective at closing the economic gap between urban centers and rural areas.' },
          ]
      },
      predictive: {
          title: 'Comparative Future Outlook',
          sections: [
              { heading: 'Land Price Trend', text: 'P1 (+2.1%): Drives higher land value spikes concentrated around its few, major commercial stations.\nP2 (+1.3%): Creates a more moderate but widespread appreciation of land values across a larger number of smaller towns.' },
              { heading: 'Business Registration', text: 'P1 (425/yr): Generates a high number of new businesses clustered around its industrial and logistics hubs.\nP2 (210/yr): Fosters the growth of smaller, community-focused businesses over a wider geographic area.' },
              { heading: 'Skilled Labor Demand', text: 'P1 (38.2k): High demand for specialized labor to operate and maintain a complex, high-speed system.\nP2 (25.6k): Demand is likely focused on "green" technology skills (hydrogen fuel cell maintenance, etc.) and community-based service roles.' },
          ]
      }
  };
