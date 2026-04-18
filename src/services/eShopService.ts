
import { Product, CartItem, Order, Discount } from '../types';
import { mockOrders } from './mockOrderData';

// Data parsed from the user-provided CSV
const rawProductData = [
  {"id":"57","imageUrl":"http://isteroidi.it/img/p/7/2/72.jpg","name":"Oxandrolone LA Pharma (5 mg/tab) 50 tabs","category":"Oxandrolone","price":48,"inStock":true},
  {"id":"249","imageUrl":"http://isteroidi.it/img/p/2/6/0/260.jpg","name":"Winstrol Depot DESMA 40 tabs (2mg/tab)","category":"Buy Oral Steroids","price":75.9,"inStock":true},
  {"id":"429","imageUrl":"http://isteroidi.it/img/p/8/9/6/896.jpg","name":"Boldelad 250 mg/ml (Boldenone Undecylenate) 10ml vial","category":"Boldenone undecylenate","price":39,"inStock":true},
  {"id":"180","imageUrl":"http://isteroidi.it/img/p/1/9/2/192.jpg","name":"Nandrobol 250, Nandrolone Decanoate, European Pharmaceutical","category":"Buy Injectable steroids","price":36,"inStock":true},
  {"id":"372","imageUrl":"http://isteroidi.it/img/p/7/2/9/729.jpg","name":"Nandrolone Decanoate","category":"Home","price":41.9,"inStock":true},
  {"id":"123","imageUrl":"http://isteroidi.it/img/p/1/3/6/136.jpg","name":"Drostanolone Propionate March (100 mg/ml) 1 ml","category":"Buy Injectable steroids","price":6.9,"inStock":true},
  {"id":"316","imageUrl":"http://isteroidi.it/img/p/3/2/6/326.jpg","name":"​​Riptropin 20 i.u. China  Injection","category":"Buy Human Growth Hormone","price":60,"inStock":true},
  {"id":"65","imageUrl":"http://isteroidi.it/img/p/8/0/80.jpg","name":"Cialis Tablets 5 tab (20mg/tab)","category":"Sexual Health","price":25,"inStock":true},
  {"id":"257","imageUrl":"http://isteroidi.it/img/p/2/6/8/268.jpg","name":"Propionate LA Pharma 1ml vial (100mg/1ml)","category":"Testosterone Propionate","price":4.1,"inStock":true},
  {"id":"437","imageUrl":"http://isteroidi.it/img/p/9/2/8/928.jpg","name":"Turinadyn 10 mg (Turinabol)","category":"Categories","price":37,"inStock":true},
  {"id":"8","imageUrl":"http://isteroidi.it/img/p/2/4/24.jpg","name":"Methandienone Injection Genesis  (100 mg/ml) 10 ml","category":"Methandienone Injection","price":36,"inStock":true},
  {"id":"188","imageUrl":"http://isteroidi.it/img/p/2/0/0/200.jpg","name":"Oxanbol, Oxanrolona, European Pharmaceutical","category":"Buy Oral Steroids","price":48,"inStock":true},
  {"id":"380","imageUrl":"http://isteroidi.it/img/p/7/5/3/753.jpg","name":"Trenbolone Enanthate","category":"Trenbolone","price":59.9,"inStock":true},
  {"id":"131","imageUrl":"http://isteroidi.it/img/p/1/4/4/144.jpg","name":"Halotestin Hubei (5 mg/tab) 50 tabs","category":"Home","price":38,"inStock":true},
  {"id":"324","imageUrl":"http://isteroidi.it/img/p/3/3/5/335.jpg","name":"CJC + IPAMORELIN","category":"Peptides","price":54,"inStock":true},
  {"id":"74","imageUrl":"http://isteroidi.it/img/p/8/8/88.jpg","name":"Danabol Balkan Pharma (10 mg/tab) 60 tabs","category":"Methandienone Injection","price":31,"inStock":true},
  {"id":"265","imageUrl":"http://isteroidi.it/img/p/2/7/6/276.jpg","name":"Sustanon 250 Organon Pakistan 250 mg/ml 1 ml","category":"Sustanon (Testosterone Mix)","price":4.3,"inStock":true},
  {"id":"16","imageUrl":"http://isteroidi.it/img/p/3/2/32.jpg","name":"Mix Products Genesis (250 mg/ml) 10 ml","category":"Sustanon (Testosterone Mix)","price":69,"inStock":true},
  {"id":"209","imageUrl":"http://isteroidi.it/img/p/2/2/0/220.jpg","name":"Finarex 200, Trenbolone Enanthate, Thaiger Pharma, 200 mg/10ml","category":"Trenbolone","price":69,"inStock":true},
  {"id":"388","imageUrl":"http://isteroidi.it/img/p/7/7/4/774.jpg","name":"Clomiphene Citrate","category":"Post Cycle Therapy","price":28.6,"inStock":true},
  {"id":"139","imageUrl":"http://isteroidi.it/img/p/1/5/2/152.jpg","name":"CJC-1295 - 5mg - BIO-PEPTIDE","category":"Peptides","price":40,"inStock":true},
  {"id":"332","imageUrl":"http://isteroidi.it/img/p/3/4/3/343.jpg","name":"IGF1-LR3","category":"Peptides","price":54,"inStock":true},
  {"id":"82","imageUrl":"http://isteroidi.it/img/p/9/6/96.jpg","name":"Cypionate 300  Elite Pharm 300 mg/1ml (10ml)","category":"Testosterone Cypionate","price":46,"inStock":true},
  {"id":"273","imageUrl":"http://isteroidi.it/img/p/2/8/5/285.jpg","name":"TB-500 - 10mg - BIO PEPTIDE","category":"Peptides","price":39,"inStock":true},
  {"id":"24","imageUrl":"http://isteroidi.it/img/p/4/0/40.jpg","name":"Stanozolol Tablets Genesis (10 mg/tab) 100 tabs","category":"Stanozolol tablets","price":37,"inStock":true},
  {"id":"217","imageUrl":"http://isteroidi.it/img/p/2/2/8/228.jpg","name":"Pribol (Methenolone Enanthate) – XBS Labs","category":"Buy Injectable steroids","price":130,"inStock":false},
  {"id":"396","imageUrl":"http://isteroidi.it/img/p/7/9/8/798.jpg","name":"Mesterolone","category":"Post Cycle Therapy","price":39.6,"inStock":true},
  {"id":"147","imageUrl":"http://isteroidi.it/img/p/1/6/0/160.jpg","name":"Sermorelin Acetate 5mg - BIO-PEPTIDE","category":"Peptides","price":59,"inStock":true},
  {"id":"340","imageUrl":"http://isteroidi.it/img/p/6/7/8/678.jpg","name":"XANAX - 30x - 1mg - Alprazolamum","category":"Sleeping pills & Antidepressants","price":65.9,"inStock":false},
  {"id":"90","imageUrl":"http://isteroidi.it/img/p/1/0/4/104.jpg","name":"Clenbuterol Chlamydem Elite Pharm 0,04mg/100 tab.","category":"Buy Oral Steroids","price":19,"inStock":true},
  {"id":"281","imageUrl":"http://isteroidi.it/img/p/2/9/3/293.jpg","name":"TRI-TRENBOLONE 200 - Magnus","category":"Buy Injectable steroids","price":84.99,"inStock":true},
  {"id":"32","imageUrl":"http://isteroidi.it/img/p/4/8/48.jpg","name":"Tamoxifen Citrate Tablets Genesis (10 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":22,"inStock":true},
  {"id":"225","imageUrl":"http://isteroidi.it/img/p/2/3/6/236.jpg","name":"Enabol (Testosterone Enathate) – XBS Labs","category":"Buy Injectable steroids","price":66,"inStock":false},
  {"id":"404","imageUrl":"http://isteroidi.it/img/p/8/2/1/821.jpg","name":"HCG 2000IU","category":"Home","price":21.6,"inStock":false},
  {"id":"156","imageUrl":"http://isteroidi.it/img/p/1/6/8/168.jpg","name":"Methandrostenolon Akrihin (5 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":19,"inStock":true},
  {"id":"348","imageUrl":"http://isteroidi.it/img/p/6/8/7/687.jpg","name":"ST Biotropin HGH Somatropin 10 iu","category":"Home","price":29.9,"inStock":true},
  {"id":"98","imageUrl":"http://isteroidi.it/img/p/1/1/2/112.jpg","name":"Propionate 200 (MAX PRO) 2000 mg/10 ml","category":"Testosterone Propionate","price":33,"inStock":true},
  {"id":"289","imageUrl":"http://isteroidi.it/img/p/3/0/1/301.jpg","name":"Stanozolol 10mg - Magnus","category":"Buy Oral Steroids","price":42,"inStock":true},
  {"id":"40","imageUrl":"http://isteroidi.it/img/p/5/6/56.jpg","name":"Trenabol Depot 100 British Dragon (100 mg/ml) 10 ml","category":"Buy Injectable steroids","price":27,"inStock":true},
  {"id":"233","imageUrl":"http://isteroidi.it/img/p/2/4/4/244.jpg","name":"Oxanabol 10mg x 100 tablets (British Dragon)","category":"Oxandrolone","price":80,"inStock":true},
  {"id":"412","imageUrl":"http://isteroidi.it/img/p/8/3/9/839.jpg","name":"GHRP-6","category":"Peptides","price":29.9,"inStock":true},
  {"id":"164","imageUrl":"http://isteroidi.it/img/p/1/7/6/176.jpg","name":"Eurochem DecaJect 200 200mg/1ml [10ml vial]","category":"Buy Injectable steroids","price":35,"inStock":true},
  {"id":"356","imageUrl":"http://isteroidi.it/img/p/6/9/5/695.jpg","name":"Progestan 200 MG ( 30 tablets)","category":"Home","price":39.9,"inStock":true},
  {"id":"106","imageUrl":"http://isteroidi.it/img/p/1/2/0/120.jpg","name":"MX 197 (Max Pro) 197mg/ml 10ml","category":"Buy Injectable steroids","price":49,"inStock":true},
  {"id":"297","imageUrl":"http://isteroidi.it/img/p/3/0/9/309.jpg","name":"YK-11 - Magnus","category":"SARMs","price":108,"inStock":true},
  {"id":"48","imageUrl":"http://isteroidi.it/img/p/6/4/64.jpg","name":"Androlic Tablets British Dispensary (50 mg/tab) 100 tabs","category":"Oxymetholone","price":86,"inStock":true},
  {"id":"241","imageUrl":"http://isteroidi.it/img/p/2/5/2/252.jpg","name":"Cytomel Hubei 50 mcg","category":"Fat Burn - Weight Loss","price":18.99,"inStock":true},
  {"id":"421","imageUrl":"http://isteroidi.it/img/p/9/4/0/940.jpg","name":"Testos 250 mg/ml (Testosterone Enanthate) 10ml vials","category":"Testosterone Enanthate","price":34.9,"inStock":true},
  {"id":"172","imageUrl":"http://isteroidi.it/img/p/1/8/4/184.jpg","name":"Eurochem PropioJect 100mg/1ml [10ml vial]","category":"Buy Injectable steroids","price":27,"inStock":true},
  {"id":"364","imageUrl":"http://isteroidi.it/img/p/7/0/4/704.jpg","name":"SAXENDA 6MG/ML 3xPENS (LIRAGLUTIDE)","category":"Fat Burn - Weight Loss","price":349,"inStock":true},
  {"id":"114","imageUrl":"http://isteroidi.it/img/p/1/2/8/128.jpg","name":"Testosterona C Balkan Pharma (200 mg/ml) 1 ml","category":"Testosterone Cypionate","price":7,"inStock":true},
  {"id":"308","imageUrl":"http://isteroidi.it/img/p/3/1/8/318.jpg","name":"Norditropin SimpleXx (1x30IU)","category":"Buy Human Growth Hormone","price":249,"inStock":true},
  {"id":"117","imageUrl":"http://isteroidi.it/img/p/1/3/1/131.jpg","name":"Nandrolona F Balkan Pharma (100 mg/ml) 1ml","category":"Buy Injectable steroids","price":4.9,"inStock":true},
  {"id":"311","imageUrl":"http://isteroidi.it/img/p/3/2/1/321.jpg","name":"​​omnitrope 45 i.u. Austria Injection","category":"Buy Human Growth Hormone","price":179,"inStock":false},
  {"id":"60","imageUrl":"http://isteroidi.it/img/p/7/5/75.jpg","name":"Sustanon 250 Organon Pakistan (250 mg/ml) 1 ml","category":"Sustanon (Testosterone Mix)","price":5.3,"inStock":true},
  {"id":"252","imageUrl":"http://isteroidi.it/img/p/2/6/3/263.jpg","name":"Deca-Nan (Nandrolone Decanoate) by LA Pharma 200mg/ml vials","category":"Buy Injectable steroids","price":6.2,"inStock":true},
  {"id":"432","imageUrl":"http://isteroidi.it/img/p/9/0/5/905.jpg","name":"Primos 100 mg/ml (Methenolone Enanthate) 10ml vial","category":"Methenolone acetate / enanthate","price":59,"inStock":true},
  {"id":"183","imageUrl":"http://isteroidi.it/img/p/1/9/5/195.jpg","name":"Stenobol 100, Methandienone, European Pharmaceutical","category":"Buy Injectable steroids","price":35,"inStock":true},
  {"id":"375","imageUrl":"http://isteroidi.it/img/p/7/3/8/738.jpg","name":"Testosterone Cypionate","category":"Home","price":33.9,"inStock":true},
  {"id":"126","imageUrl":"http://isteroidi.it/img/p/1/3/9/139.jpg","name":"Nandrolone Decanoate March (200 mg/ml) 1 ml","category":"Buy Injectable steroids","price":5.9,"inStock":true},
  {"id":"319","imageUrl":"http://isteroidi.it/img/p/3/3/0/330.jpg","name":"​​Folistatin  Magnus","category":"Peptides","price":89,"inStock":true},
  {"id":"69","imageUrl":"http://isteroidi.it/img/p/8/3/83.jpg","name":"Tamoxifen Ebewe (10 mg/tab) 100 tabs","category":"Post Cycle Therapy","price":27,"inStock":true},
  {"id":"260","imageUrl":"http://isteroidi.it/img/p/2/7/1/271.jpg","name":"Oxymetholone LA Pharma 100 tabs (50mg/tab)","category":"Buy Oral Steroids","price":69.99,"inStock":true},
  {"id":"11","imageUrl":"http://isteroidi.it/img/p/2/7/27.jpg","name":"Primobolan Injection Genesis (100 mg/ml) 10 ml","category":"Methenolone acetate / enanthate","price":65,"inStock":true},
  {"id":"192","imageUrl":"http://isteroidi.it/img/p/2/0/3/203.jpg","name":"Turinabol, Methyltestosterone, European Pharmaceutical","category":"Methyltestosterone","price":25,"inStock":true},
  {"id":"383","imageUrl":"http://isteroidi.it/img/p/7/6/2/762.jpg","name":"Cut Stack/Cut Mix","category":"Testosterone Propionate","price":54.9,"inStock":true},
  {"id":"134","imageUrl":"http://isteroidi.it/img/p/1/4/7/147.jpg","name":"Anavar Hubei (10 mg/tab) 50 tabs","category":"Oxandrolone","price":38,"inStock":true},
  {"id":"327","imageUrl":"http://isteroidi.it/img/p/3/3/8/338.jpg","name":"Selank - 5mg Magnus","category":"Peptides","price":54,"inStock":true},
  {"id":"77","imageUrl":"http://isteroidi.it/img/p/9/1/91.jpg","name":"Sustanon 300 Elite Pharm 300 mg/ml (10 ml)","category":"Buy Injectable steroids","price":48,"inStock":true},
  {"id":"268","imageUrl":"http://isteroidi.it/img/p/6/7/4/674.jpg","name":"Viagra 100 Pfizer 100mg","category":"Sexual Health","price":69.99,"inStock":true},
  {"id":"19","imageUrl":"http://isteroidi.it/img/p/3/5/35.jpg","name":"Testosterone Cypionate Genesis (250 mg/ml) 10 ml","category":"Testosterone Cypionate","price":34,"inStock":true},
  {"id":"212","imageUrl":"http://isteroidi.it/img/p/2/2/3/223.jpg","name":"Cytex 250, Testosterone Cypionate, Thaiger Pharma, 250mg/10ml","category":"Testosterone Cypionate","price":35,"inStock":true},
  {"id":"391","imageUrl":"http://isteroidi.it/img/p/7/8/3/783.jpg","name":"T4-Levothyroxine sodium","category":"Fat Burn - Weight Loss","price":19.9,"inStock":true},
  {"id":"142","imageUrl":"http://isteroidi.it/img/p/1/5/5/155.jpg","name":"GHRP-6 - 10mg - BIO-PEPTIDE","category":"Peptides","price":33.9,"inStock":true},
  {"id":"335","imageUrl":"http://isteroidi.it/img/p/3/4/6/346.jpg","name":"CJC-1295 DAC - 2mg Magnus","category":"Peptides","price":52,"inStock":true},
  {"id":"85","imageUrl":"http://isteroidi.it/img/p/9/9/99.jpg","name":"Trebolone Acetate 150 Elite Pharm 150mg/1ml (10ml)","category":"Buy Injectable steroids","price":75,"inStock":true},
  {"id":"276","imageUrl":"http://isteroidi.it/img/p/2/8/8/288.jpg","name":"PRIMOBOLAN - Methenolone enanthate 100mg - Magnus","category":"Buy Injectable steroids","price":109,"inStock":true},
  {"id":"27","imageUrl":"http://isteroidi.it/img/p/4/3/43.jpg","name":"Methyltestosterone Tablets Genesis (25 mg/tab) 100 tabs","category":"Methyltestosterone","price":38,"inStock":true},
  {"id":"220","imageUrl":"http://isteroidi.it/img/p/2/3/1/231.jpg","name":"Parbol (Trenbolone Hexahydrobenzylcarbonate) – XBS Labs","category":"Buy Injectable steroids","price":130,"inStock":false},
  {"id":"399","imageUrl":"http://isteroidi.it/img/p/8/0/7/807.jpg","name":"Turinabol","category":"Buy Oral Steroids","price":34.9,"inStock":true},
  {"id":"150","imageUrl":"http://isteroidi.it/img/p/1/6/3/163.jpg","name":"PT-141 (Bremelanotide) 10mg - BIO-PEPTIDE","category":"Sexual Health","price":46,"inStock":true},
  {"id":"343","imageUrl":"http://isteroidi.it/img/p/6/8/2/682.jpg","name":"BlendoteX (nandrol dec.100mg/ml+ test enatnth 150mg/ml.) 250 mg/ml","category":"Home","price":49.9,"inStock":true},
  {"id":"93","imageUrl":"http://isteroidi.it/img/p/1/0/7/107.jpg","name":"Anabol Tablets British Dispensary (5 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":21,"inStock":true},
  {"id":"284","imageUrl":"http://isteroidi.it/img/p/2/9/6/296.jpg","name":"SUSTANON 250 - Testosterone mix U.S.P. 250mg - Magnus","category":"Sustanon (Testosterone Mix)","price":46.99,"inStock":true},
  {"id":"35","imageUrl":"http://isteroidi.it/img/p/5/1/51.jpg","name":"Decabol 250 British Dragon (250 mg/ml) 10 ml","category":"Nandrolone Decanoate","price":24,"inStock":true},
  {"id":"228","imageUrl":"http://isteroidi.it/img/p/2/3/9/239.jpg","name":"Clebol (Albuterol, Yohimbin) – XBS Labs","category":"Fat Burn - Weight Loss","price":55,"inStock":false},
  {"id":"407","imageUrl":"http://isteroidi.it/img/p/8/2/6/826.jpg","name":"Tadalafil C-20","category":"Sexual Health","price":16.9,"inStock":true},
  {"id":"159","imageUrl":"http://isteroidi.it/img/p/1/7/1/171.jpg","name":"Stanozolol Bayer (10 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":34,"inStock":false},
  {"id":"351","imageUrl":"http://isteroidi.it/img/p/6/9/0/690.jpg","name":"ROACCUTANE 20 MG 30 CAPS","category":"Home","price":59.9,"inStock":true},
  {"id":"101","imageUrl":"http://isteroidi.it/img/p/1/1/5/115.jpg","name":"Primobolan 100 (MAX PRO) 1000 mg/10 ml","category":"Buy Injectable steroids","price":48,"inStock":true},
  {"id":"292","imageUrl":"http://isteroidi.it/img/p/3/0/4/304.jpg","name":"TURINABOL - 4-Chlorodehydromethyltestosterone 10mg - Magnus","category":"Buy Oral Steroids","price":80,"inStock":true},
  {"id":"43","imageUrl":"http://isteroidi.it/img/p/5/9/59.jpg","name":"Testabol Depot British Dragon (200 mg/ml) 10 ml","category":"Testosterone Propionate","price":24,"inStock":true},
  {"id":"236","imageUrl":"http://isteroidi.it/img/p/2/4/7/247.jpg","name":"Stanol 50mg - Body Research","category":"Buy Oral Steroids","price":5.2,"inStock":true},
  {"id":"415","imageUrl":"http://isteroidi.it/img/p/8/4/8/848.jpg","name":"PEG MGF","category":"Peptides","price":34.9,"inStock":true},
  {"id":"167","imageUrl":"http://isteroidi.it/img/p/1/7/9/179.jpg","name":"Eurochem TrenaJect 75mg/1ml [10ml vial]","category":"Trenbolone","price":36,"inStock":true},
  {"id":"359","imageUrl":"http://isteroidi.it/img/p/6/9/8/698.jpg","name":"Ultimate Nootropic Booster – Brain Food 60 tabs","category":"Vitamins","price":59.9,"inStock":true},
  {"id":"109","imageUrl":"http://isteroidi.it/img/p/1/2/3/123.jpg","name":"Nandrolona D Balkan Pharma (200 mg/ml) 1 ml","category":"Buy Injectable steroids","price":4.9,"inStock":true},
  {"id":"300","imageUrl":"http://isteroidi.it/img/p/8/5/4/854.jpg","name":"Adipex Retard - Phenterminum resinatum - 100x","category":"Fat Burn - Weight Loss","price":269.9,"inStock":true},
  {"id":"51","imageUrl":"http://isteroidi.it/img/p/6/7/67.jpg","name":"Danabol DS Body Research (10 mg/tab) 500 tabs","category":"Buy Oral Steroids","price":75,"inStock":true},
  {"id":"244","imageUrl":"http://isteroidi.it/img/p/2/5/5/255.jpg","name":"Primobolan Depot 1 ml amp (100 mg/ml)","category":"Buy Injectable steroids","price":6.9,"inStock":true},
  {"id":"424","imageUrl":"http://isteroidi.it/img/p/9/3/9/939.jpg","name":"Trenacetos 100 mg/ml (Trenbolone Acetate) 10ml vial","category":"Trenbolone","price":49.9,"inStock":true},
  {"id":"175","imageUrl":"http://isteroidi.it/img/p/1/8/7/187.jpg","name":"Cypiobol 250, Testosterone Cypionate, European Pharmaceutical","category":"Buy Injectable steroids","price":33,"inStock":true},
  {"id":"367","imageUrl":"http://isteroidi.it/img/p/7/1/1/711.jpg","name":"CJC-1295 DAC - HILMA BIOCARE","category":"Home","price":39.9,"inStock":true},
  {"id":"427","imageUrl":"http://isteroidi.it/img/p/8/8/6/886.jpg","name":"Drostargos 200 mg/ml (Drostanolone Enanthate) 10ml vial","category":"Drostanolone Propionate","price":54.9,"inStock":true},
  {"id":"178","imageUrl":"http://isteroidi.it/img/p/1/9/0/190.jpg","name":"Equibol 250, Boldenone Undecylenate 250mg/10ml, European Pharmaceutical","category":"Boldenone undecylenate","price":36,"inStock":true},
  {"id":"370","imageUrl":"http://isteroidi.it/img/p/7/2/0/720.jpg","name":"Boldenone Undecylanate","category":"Home","price":42.9,"inStock":true},
  {"id":"121","imageUrl":"http://isteroidi.it/img/p/1/3/4/134.jpg","name":"Trenbolone Enanthate March (200 mg/ml) 1 ml","category":"Buy Injectable steroids","price":7.9,"inStock":true},
  {"id":"314","imageUrl":"http://isteroidi.it/img/p/3/2/4/324.jpg","name":"​TB500 - Magnus","category":"Peptides","price":52,"inStock":true},
  {"id":"63","imageUrl":"http://isteroidi.it/img/p/7/8/78.jpg","name":"Testosterony Propionat Farmak (50 mg/ml) 1 ml","category":"Testosterone Propionate","price":2.9,"inStock":true},
  {"id":"255","imageUrl":"http://isteroidi.it/img/p/2/6/6/266.jpg","name":"Stanozolol Injection 50mg La Pharma","category":"Stanozolol Injection","price":5.9,"inStock":true},
  {"id":"435","imageUrl":"http://isteroidi.it/img/p/9/2/0/920.jpg","name":"Anadrolus 50 mg (Oxymetholone)","category":"Oxymetholone","price":33,"inStock":true},
  {"id":"186","imageUrl":"http://isteroidi.it/img/p/1/9/8/198.jpg","name":"Trenbol 200, Trenbolone Mix, European Pharmaceutical","category":"Trenbolone","price":37,"inStock":true},
  {"id":"378","imageUrl":"http://isteroidi.it/img/p/7/4/7/747.jpg","name":"Sustanon","category":"Sustanon (Testosterone Mix)","price":36.6,"inStock":true},
  {"id":"129","imageUrl":"http://isteroidi.it/img/p/1/4/2/142.jpg","name":"Nolvadex Hubei (20 mg/tab) 30 tabs","category":"Post Cycle Therapy","price":18,"inStock":true},
  {"id":"322","imageUrl":"http://isteroidi.it/img/p/3/3/3/333.jpg","name":"GHRP-2 10mg Magnus","category":"Peptides","price":44,"inStock":true},
  {"id":"72","imageUrl":"http://isteroidi.it/img/p/8/6/86.jpg","name":"Clenbuterol Balkan Pharma (0,04mg/tab) 100 tab","category":"Buy Oral Steroids","price":29,"inStock":true},
  {"id":"263","imageUrl":"http://isteroidi.it/img/p/2/7/4/274.jpg","name":"Hygetropin HGH - 10 Vials 100 IU","category":"Buy Human Growth Hormone","price":199.9,"inStock":true},
  {"id":"14","imageUrl":"http://isteroidi.it/img/p/3/0/30.jpg","name":"Trenbolone Enanthate Genesis (200 mg/ml) 10 ml","category":"Buy Injectable steroids","price":69,"inStock":true},
  {"id":"207","imageUrl":"http://isteroidi.it/img/p/2/1/8/218.jpg","name":"Dexxa 250, Nandrolone Decanoate, Thaiger Pharma, 250 mg/10 ml","category":"Nandrolone Decanoate","price":49,"inStock":true},
  {"id":"386","imageUrl":"http://isteroidi.it/img/p/7/7/0/770.jpg","name":"Testosterone Enanthate Ampoules","category":"Buy Injectable steroids","price":29.9,"inStock":true},
  {"id":"137","imageUrl":"http://isteroidi.it/img/p/1/5/0/150.jpg","name":"Testosterone enanthate IRAN (250 mg/ml) 1ml","category":"Testosterone Enanthate","price":4.9,"inStock":true},
  {"id":"330","imageUrl":"http://isteroidi.it/img/p/3/4/1/341.jpg","name":"HGH Fragment 176-191 Magnus","category":"Peptides","price":45,"inStock":true},
  {"id":"80","imageUrl":"http://isteroidi.it/img/p/9/4/94.jpg","name":"Decanoate 250 Elite Pharm 250 mg/1ml (10ml)","category":"Buy Injectable steroids","price":62,"inStock":true},
  {"id":"271","imageUrl":"http://isteroidi.it/img/p/2/8/3/283.jpg","name":"Dapoxy-60 Shree Venkatesh 60mg/tab [10 tabs]","category":"Sexual Health","price":44.99,"inStock":true},
  {"id":"22","imageUrl":"http://isteroidi.it/img/p/3/8/38.jpg","name":"Sibutramine Tablets Genesis (20 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":59.9,"inStock":true},
  {"id":"215","imageUrl":"http://isteroidi.it/img/p/2/2/6/226.jpg","name":"Massbol (Drostanolone Propionate) – XBS Labs","category":"Buy Injectable steroids","price":80,"inStock":false},
  {"id":"394","imageUrl":"http://isteroidi.it/img/p/7/9/2/792.jpg","name":"Oxandrolone","category":"Buy Oral Steroids","price":59.9,"inStock":true},
  {"id":"145","imageUrl":"http://isteroidi.it/img/p/1/5/8/158.jpg","name":"MGF 5mg - BIO-PEPTIDE","category":"Peptides","price":34.9,"inStock":true},
  {"id":"338","imageUrl":"http://isteroidi.it/img/p/6/7/5/675.jpg","name":"Aicar 30x10mg (Envenom Pharm)","category":"Peptides","price":69.99,"inStock":true},
  {"id":"88","imageUrl":"http://isteroidi.it/img/p/1/0/2/102.jpg","name":"Methandienone Magma Elite Pharm 10mg/200 tab.","category":"Buy Oral Steroids","price":40,"inStock":true},
  {"id":"279","imageUrl":"http://isteroidi.it/img/p/2/9/1/291.jpg","name":"Trenbolone enanthate 200mg - Magnus","category":"Trenbolone","price":79.99,"inStock":true},
  {"id":"30","imageUrl":"http://isteroidi.it/img/p/4/6/46.jpg","name":"T3 Genesis (50 mcg/tab) 100 tabs","category":"Fat Burn - Weight Loss","price":29.9,"inStock":true},
  {"id":"223","imageUrl":"http://isteroidi.it/img/p/2/3/4/234.jpg","name":"Bodbol (Boldenone Undecylenate) – XBS Labs","category":"Boldenone undecylenate","price":80,"inStock":false},
  {"id":"402","imageUrl":"http://isteroidi.it/img/p/8/1/6/816.jpg","name":"Letrozole","category":"Post Cycle Therapy","price":34.9,"inStock":true},
  {"id":"153","imageUrl":"http://isteroidi.it/img/p/1/6/6/166.jpg","name":"Cypionax Body Research (200 mg/ml) 2ml","category":"Testosterone Cypionate","price":6.7,"inStock":true},
  {"id":"346","imageUrl":"http://isteroidi.it/img/p/6/8/5/685.jpg","name":"Nolvaden 20mg B.M. Pharma (tamoxifen citrate) 20mg/tab x 50tb","category":"Home","price":34.4,"inStock":true},
  {"id":"96","imageUrl":"http://isteroidi.it/img/p/1/1/0/110.jpg","name":"Winstrol (MAX PRO) 750 mg/10 ml","category":"Stanozolol Injection","price":43,"inStock":true},
  {"id":"287","imageUrl":"http://isteroidi.it/img/p/2/9/9/299.jpg","name":"TEST P - Testosterone propionate U.S.P. 100mg - Magnus","category":"Testosterone Propionate","price":40,"inStock":true},
  {"id":"38","imageUrl":"http://isteroidi.it/img/p/5/4/54.jpg","name":"Boldabol 200 British Dragon (200 mg/ml) 10 ml","category":"Buy Injectable steroids","price":27,"inStock":true},
  {"id":"231","imageUrl":"http://isteroidi.it/img/p/2/4/2/242.jpg","name":"Methanabol 10mg x 100 tablets (British Dragon)","category":"Methandienone - Dianabol","price":25,"inStock":true},
  {"id":"410","imageUrl":"http://isteroidi.it/img/p/8/3/4/834.jpg","name":"HGH (Lyophilized/Powder)","category":"Buy Human Growth Hormone","price":249.9,"inStock":true},
  {"id":"162","imageUrl":"http://isteroidi.it/img/p/1/7/4/174.jpg","name":"Somatrope Pharm  (1x15IU)","category":"Buy Human Growth Hormone","price":56,"inStock":true},
  {"id":"354","imageUrl":"http://isteroidi.it/img/p/6/9/3/693.jpg","name":"TESTOGEL 50 mg ( 30 packs)","category":"Home","price":129.9,"inStock":true},
  {"id":"104","imageUrl":"http://isteroidi.it/img/p/1/1/8/118.jpg","name":"Nandrolone Decanoate (MAX PRO) 2500 mg/10 ml","category":"Buy Injectable steroids","price":43,"inStock":true},
  {"id":"295","imageUrl":"http://isteroidi.it/img/p/3/0/7/307.jpg","name":"Ostarine (MK-2866) - Magnus","category":"SARMs","price":79.9,"inStock":true},
  {"id":"46","imageUrl":"http://isteroidi.it/img/p/6/2/62.jpg","name":"Mastabol 100 British Dragon (100 mg/ml) 10 ml","category":"Drostanolone Propionate","price":28,"inStock":true},
  {"id":"239","imageUrl":"http://isteroidi.it/img/p/2/5/0/250.jpg","name":"Primobolan Hubei 25 mg","category":"Buy Oral Steroids","price":39.99,"inStock":true},
  {"id":"418","imageUrl":"http://isteroidi.it/img/p/8/5/3/853.jpg","name":"Sustanon Aspen Pharmacy 250mg","category":"Sustanon (Testosterone Mix)","price":4.9,"inStock":true},
  {"id":"170","imageUrl":"http://isteroidi.it/img/p/1/8/2/182.jpg","name":"Eurochem CypioJect 200 200mg/1ml [10ml vial]","category":"Buy Injectable steroids","price":36,"inStock":true},
  {"id":"362","imageUrl":"http://isteroidi.it/img/p/7/0/2/702.jpg","name":"Epitalon 10mg","category":"Peptides","price":39.9,"inStock":true},
  {"id":"112","imageUrl":"http://isteroidi.it/img/p/1/2/6/126.jpg","name":"Sustamed Balkan Pharma (250 mg/ml) 1 ml","category":"Sustanon (Testosterone Mix)","price":4.3,"inStock":true},
  {"id":"303","imageUrl":"http://isteroidi.it/img/p/3/1/6/316.jpg","name":"Humanotrope 30 i.u. China  Injection","category":"Buy Human Growth Hormone","price":119,"inStock":true},
  {"id":"55","imageUrl":"http://isteroidi.it/img/p/7/0/70.jpg","name":"Stanozolol LA Pharma (10 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":34,"inStock":true},
  {"id":"247","imageUrl":"http://isteroidi.it/img/p/2/5/8/258.jpg","name":"T4 Cytomel Uni-Pharma 30tabs/200mcg","category":"Post Cycle Therapy","price":25,"inStock":true},
  {"id":"309","imageUrl":"http://isteroidi.it/img/p/3/1/9/319.jpg","name":"Genotropin 36 i.u.  Injection","category":"Buy Human Growth Hormone","price":299,"inStock":false},
  {"id":"58","imageUrl":"http://isteroidi.it/img/p/7/3/73.jpg","name":"Clenbuterol LA Pharma (0,02 mg/tab) 200 tabsv","category":"Buy Oral Steroids","price":34,"inStock":true},
  {"id":"250","imageUrl":"http://isteroidi.it/img/p/2/6/1/261.jpg","name":"Testex Elmu Prolongatum Q Pharma 2ml amp (250mg/2ml)","category":"Buy Injectable steroids","price":8.2,"inStock":true},
  {"id":"430","imageUrl":"http://isteroidi.it/img/p/9/0/0/900.jpg","name":"Hexos 75 mg/ml (Trenbolone Hexahydrobenzyl Carbonate)","category":"Trenbolone","price":59.9,"inStock":true},
  {"id":"181","imageUrl":"http://isteroidi.it/img/p/1/9/3/193.jpg","name":"Parabol 100, Trenbolone Acetate, European Pharmaceutical","category":"Buy Injectable steroids","price":36,"inStock":true},
  {"id":"373","imageUrl":"http://isteroidi.it/img/p/7/3/2/732.jpg","name":"Nandrolone Phenylpropionate","category":"Home","price":34.9,"inStock":true},
  {"id":"124","imageUrl":"http://isteroidi.it/img/p/1/3/7/137.jpg","name":"Boldenone Undecylenate March (200 mg/ml) 1 ml","category":"Buy Injectable steroids","price":6.9,"inStock":true},
  {"id":"317","imageUrl":"http://isteroidi.it/img/p/3/2/7/327.jpg","name":"​​Kigtropin 20 i.u.  China  Injection","category":"Buy Human Growth Hormone","price":60,"inStock":true},
  {"id":"66","imageUrl":"http://isteroidi.it/img/p/8/1/81.jpg","name":"Kamagra Gold Green (100 mg/tab) 4 tabs","category":"Sexual Health","price":16,"inStock":true},
  {"id":"258","imageUrl":"http://isteroidi.it/img/p/2/6/9/269.jpg","name":"Primabolan LA Pharma 30 tabs (25mg/tab)","category":"Buy Oral Steroids","price":69.99,"inStock":true},
  {"id":"438","imageUrl":"http://isteroidi.it/img/p/9/3/0/930.jpg","name":"Methacetos 25 mg (Methenolone acetate)","category":"Methenolone acetate / enanthate","price":69,"inStock":true},
  {"id":"9","imageUrl":"http://isteroidi.it/img/p/2/5/25.jpg","name":"Nandrolone Decanoate Genesis (250 mg/ml) 10 ml","category":"Buy Injectable steroids","price":50,"inStock":true},
  {"id":"189","imageUrl":"http://isteroidi.it/img/p/2/0/1/201.jpg","name":"Oxybol, Oxymetholone, European Pharmaceutical","category":"Buy Oral Steroids","price":39,"inStock":true},
  {"id":"381","imageUrl":"http://isteroidi.it/img/p/7/5/6/756.jpg","name":"Trenbolone Acetate","category":"Trenbolone","price":47.9,"inStock":true},
  {"id":"132","imageUrl":"http://isteroidi.it/img/p/1/4/5/145.jpg","name":"Methyl Hubei (10 mg/tab) 50 tabs","category":"Methyltestosterone","price":17,"inStock":true},
  {"id":"325","imageUrl":"http://isteroidi.it/img/p/3/3/6/336.jpg","name":"DSIP - 5mg Magnus","category":"Peptides","price":57,"inStock":true},
  {"id":"75","imageUrl":"http://isteroidi.it/img/p/8/9/89.jpg","name":"Strombafort Balkan Pharma (10 mg/tab) 60 tabs","category":"Stanozolol tablets","price":42,"inStock":true},
  {"id":"266","imageUrl":"http://isteroidi.it/img/p/2/7/7/277.jpg","name":"Poppers Rush Ultra Strong 10ml","category":"Sexual Health","price":7.99,"inStock":false},
  {"id":"17","imageUrl":"http://isteroidi.it/img/p/3/3/33.jpg","name":"Drostanolone Genesis (100 mg/ml) 10 ml","category":"Drostanolone Propionate","price":62,"inStock":true},
  {"id":"210","imageUrl":"http://isteroidi.it/img/p/2/2/1/221.jpg","name":"Finexal 100, (Trenbolone Acetate) Thaiger Pharma, 100 mg/ml (10 ml)","category":"Trenbolone","price":68,"inStock":true},
  {"id":"389","imageUrl":"http://isteroidi.it/img/p/7/7/7/777.jpg","name":"Clenbuterol Hilma Biocare","category":"Fat Burn - Weight Loss","price":19.9,"inStock":true},
  {"id":"140","imageUrl":"http://isteroidi.it/img/p/1/5/3/153.jpg","name":"Folistatin 344 - 1mg - BIO PEPTIDE","category":"Peptides","price":59,"inStock":true},
  {"id":"333","imageUrl":"http://isteroidi.it/img/p/3/4/4/344.jpg","name":"PT 141 Bremelanotide Peptide Magnus","category":"Peptides","price":68,"inStock":true},
  {"id":"83","imageUrl":"http://isteroidi.it/img/p/9/7/97.jpg","name":"Propionate 150 Elite Pharm 150mg/1ml (10ml)","category":"Testosterone Propionate","price":45,"inStock":true},
  {"id":"274","imageUrl":"http://isteroidi.it/img/p/2/8/6/286.jpg","name":"Nandrolone decanoate U.S.P. 250mg - Magnus","category":"Nandrolone Decanoate","price":59.99,"inStock":true},
  {"id":"25","imageUrl":"http://isteroidi.it/img/p/4/1/41.jpg","name":"Oxandrolone Tablets Genesis  (10 mg/tab) 100 tabs","category":"Oxandrolone","price":99,"inStock":true},
  {"id":"218","imageUrl":"http://isteroidi.it/img/p/2/2/9/229.jpg","name":"Stabol (Stanozolol) – XBS Labs","category":"Stanozolol Injection","price":75,"inStock":false},
  {"id":"397","imageUrl":"http://isteroidi.it/img/p/8/0/1/801.jpg","name":"Tamoxifen Citrate","category":"Post Cycle Therapy","price":24.9,"inStock":true},
  {"id":"148","imageUrl":"http://isteroidi.it/img/p/1/6/1/161.jpg","name":"Ipamorelin 10mg - BIO-PEPTIDE","category":"Peptides","price":48,"inStock":true},
  {"id":"341","imageUrl":"http://isteroidi.it/img/p/6/7/9/679.jpg","name":"Yeduc Sibutramine 100 tabs 15 mg","category":"Fat Burn - Weight Loss","price":65.9,"inStock":true},
  {"id":"91","imageUrl":"http://isteroidi.it/img/p/1/0/5/105.jpg","name":"Kamagra Oral Jelly (100 mg/tab) 7-sack","category":"Sexual Health","price":29,"inStock":true},
  {"id":"282","imageUrl":"http://isteroidi.it/img/p/2/9/4/294.jpg","name":"STANOZOLOL INJECTION - 50mg - Magnus","category":"Buy Injectable steroids","price":40,"inStock":true},
  {"id":"33","imageUrl":"http://isteroidi.it/img/p/4/9/49.jpg","name":"Clomiphene Citrate Tablets Genesis (50 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":29,"inStock":true},
  {"id":"226","imageUrl":"http://isteroidi.it/img/p/2/3/7/237.jpg","name":"Cypbol (Testosterone Cypionate) – XBS Labs","category":"Buy Injectable steroids","price":66,"inStock":false},
  {"id":"405","imageUrl":"http://isteroidi.it/img/p/8/2/2/822.jpg","name":"HCG 1000IU","category":"Home","price":54.9,"inStock":false},
  {"id":"157","imageUrl":"http://isteroidi.it/img/p/1/6/9/169.jpg","name":"Nebido Bayer (1000 mg/4 ml) 4 ml","category":"Sustanon (Testosterone Mix)","price":89.9,"inStock":false},
  {"id":"349","imageUrl":"http://isteroidi.it/img/p/6/8/8/688.jpg","name":"Testosteron Depot 250 Eifelfango 5 ampules","category":"Home","price":26.9,"inStock":true},
  {"id":"99","imageUrl":"http://isteroidi.it/img/p/1/1/3/113.jpg","name":"Cypionate 200 (MAX PRO) 2000 mg/10 ml","category":"Buy Injectable steroids","price":32,"inStock":true},
  {"id":"290","imageUrl":"http://isteroidi.it/img/p/3/0/2/302.jpg","name":"Oxandrolone 10mg - Magnus","category":"Buy Oral Steroids","price":99.9,"inStock":true},
  {"id":"41","imageUrl":"http://isteroidi.it/img/p/5/7/57.jpg","name":"Stanabol 50 British Dragon (50 mg/ml) 10 ml","category":"Buy Injectable steroids","price":29,"inStock":true},
  {"id":"234","imageUrl":"http://isteroidi.it/img/p/2/4/5/245.jpg","name":"Oxydrol 50mg x 100 tablets (British Dragon)","category":"Oxymetholone","price":80,"inStock":true},
  {"id":"413","imageUrl":"http://isteroidi.it/img/p/8/4/2/842.jpg","name":"Melanotane-2","category":"Home","price":0,"inStock":false},
  {"id":"165","imageUrl":"http://isteroidi.it/img/p/1/7/7/177.jpg","name":"Eurochem DuraJect 100 100mg/1ml [10ml vial]","category":"Buy Injectable steroids","price":37,"inStock":true},
  {"id":"357","imageUrl":"http://isteroidi.it/img/p/6/9/6/696.jpg","name":"Nouveaux Sibutramine 20 mg (100 Tabs)","category":"Home","price":75.9,"inStock":true},
  {"id":"107","imageUrl":"http://isteroidi.it/img/p/1/2/1/121.jpg","name":"Primobolan Tablets Genesis (25 mg/tab) 50 tabs","category":"Methenolone acetate / enanthate","price":113,"inStock":true},
  {"id":"298","imageUrl":"http://isteroidi.it/img/p/3/1/0/310.jpg","name":"RAD140 (Testolone) - Magnus","category":"SARMs","price":84.9,"inStock":true},
  {"id":"49","imageUrl":"http://isteroidi.it/img/p/6/5/65.jpg","name":"Azolol British Dispensary (5 mg/tab) 400 tabs","category":"Stanozolol tablets","price":98,"inStock":true},
  {"id":"242","imageUrl":"http://isteroidi.it/img/p/2/5/3/253.jpg","name":"Proviron Schering 25mg","category":"Post Cycle Therapy","price":24,"inStock":true},
  {"id":"422","imageUrl":"http://isteroidi.it/img/p/8/6/3/863.jpg","name":"Cypilos 250 mg/ml (Testosterone Cypionate) 10ml vial","category":"Testosterone Cypionate","price":34,"inStock":true},
  {"id":"173","imageUrl":"http://isteroidi.it/img/p/1/8/5/185.jpg","name":"Eurochem Primoject 100 100mg/1ml [10ml vial]","category":"Methenolone acetate / enanthate","price":35,"inStock":true},
  {"id":"365","imageUrl":"http://isteroidi.it/img/p/7/0/5/705.jpg","name":"TB-500 - HILMA BIOCARE","category":"Home","price":39.9,"inStock":true},
  {"id":"115","imageUrl":"http://isteroidi.it/img/p/1/2/9/129.jpg","name":"Testosterona P Balkan Pharma (100 mg/ml) 1 ml","category":"Testosterone Propionate","price":3.9,"inStock":true},
  {"id":"176","imageUrl":"http://isteroidi.it/img/p/1/8/8/188.jpg","name":"Depobol 250, Testosterone Enanthate, European Pharmaceutical","category":"Buy Injectable steroids","price":33,"inStock":true},
  {"id":"368","imageUrl":"http://isteroidi.it/img/p/7/1/4/714.jpg","name":"GHRP-6 - HILMA BIOCARE","category":"Home","price":29.9,"inStock":true},
  {"id":"118","imageUrl":"http://isteroidi.it/img/p/1/3/2/132.jpg","name":"Anapolon Oxymetholone Balkan Pharma 100tab","category":"Buy Injectable steroids","price":79.9,"inStock":true},
  {"id":"312","imageUrl":"http://isteroidi.it/img/p/3/2/2/322.jpg","name":"GHRP6 - Magnus","category":"Peptides","price":49,"inStock":true},
  {"id":"61","imageUrl":"http://isteroidi.it/img/p/7/6/76.jpg","name":"Omnadren 250 Jelfa (250 mg/ml) 1 ml","category":"Sustanon (Testosterone Mix)","price":4.7,"inStock":true},
  {"id":"253","imageUrl":"http://isteroidi.it/img/p/2/6/4/264.jpg","name":"Primabolan LA Pharma 1ml amp (100mg/1ml)","category":"Buy Injectable steroids","price":8.6,"inStock":true},
  {"id":"433","imageUrl":"http://isteroidi.it/img/p/9/1/0/910.jpg","name":"Dinabolyn 10 mg (Methandienone)","category":"Methandienone - Dianabol","price":26,"inStock":true},
  {"id":"184","imageUrl":"http://isteroidi.it/img/p/1/9/6/196.jpg","name":"Superbol 100, Nandrolone Phenylpropionate, European Pharmaceutical","category":"Buy Injectable steroids","price":36,"inStock":true},
  {"id":"376","imageUrl":"http://isteroidi.it/img/p/7/4/1/741.jpg","name":"Testosterone Propionate","category":"Home","price":29.9,"inStock":true},
  {"id":"127","imageUrl":"http://isteroidi.it/img/p/1/4/0/140.jpg","name":"Reduce Ordain (15 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":99,"inStock":true},
  {"id":"320","imageUrl":"http://isteroidi.it/img/p/3/3/1/331.jpg","name":"GHRP-6 + CJC-1295 + IPAMORELIN","category":"Peptides","price":59,"inStock":true},
  {"id":"70","imageUrl":"http://isteroidi.it/img/p/8/4/84.jpg","name":"Deca Durabolin Organon (100 mg/ml) 1 ml","category":"Nandrolone Decanoate","price":4.9,"inStock":true},
  {"id":"261","imageUrl":"http://isteroidi.it/img/p/2/7/2/272.jpg","name":"Halotestin LA Pharma 30 tabs (10mg/tab)","category":"Halotestin","price":89.99,"inStock":true},
  {"id":"12","imageUrl":"http://isteroidi.it/img/p/2/8/28.jpg","name":"Bolde 250 Genesis (250 mg/ml) 10 ml","category":"Buy Injectable steroids","price":59,"inStock":true},
  {"id":"193","imageUrl":"http://isteroidi.it/img/p/2/0/4/204.jpg","name":"Winibol 100, Stanozolol Injection, European Pharmaceutical","category":"Buy Injectable steroids","price":39,"inStock":true},
  {"id":"384","imageUrl":"http://isteroidi.it/img/p/7/6/5/765.jpg","name":"Methenolone Enanthate","category":"Methenolone acetate / enanthate","price":56,"inStock":true},
  {"id":"135","imageUrl":"http://isteroidi.it/img/p/1/4/8/148.jpg","name":"Stromba Hubei (10 mg/tab) 50 tabs","category":"Stanozolol tablets","price":19,"inStock":true},
  {"id":"328","imageUrl":"http://isteroidi.it/img/p/3/3/9/339.jpg","name":"Epithalon Peptide Magnus","category":"Peptides","price":49,"inStock":true},
  {"id":"78","imageUrl":"http://isteroidi.it/img/p/9/2/92.jpg","name":"Drostanolone 150 Elite Pharm 150mg/1ml (10ml)","category":"Buy Injectable steroids","price":77,"inStock":true},
  {"id":"269","imageUrl":"http://isteroidi.it/img/p/2/8/1/281.jpg","name":"Cobra 120 mg / 5 pills","category":"Sexual Health","price":19.99,"inStock":true},
  {"id":"20","imageUrl":"http://isteroidi.it/img/p/3/6/36.jpg","name":"Testosterone Enanthate Genesis (250 mg/ml) 10 ml","category":"Testosterone Enanthate","price":34,"inStock":true},
  {"id":"213","imageUrl":"http://isteroidi.it/img/p/2/2/4/224.jpg","name":"Prosten 150, Testosterone Propionate, Thaiger Pharma, 150 mg/10 ml","category":"Buy Injectable steroids","price":34,"inStock":true},
  {"id":"392","imageUrl":"http://isteroidi.it/img/p/7/8/6/786.jpg","name":"Primobolan Acetate","category":"Primobolan (Methenolone)","price":87,"inStock":true},
  {"id":"143","imageUrl":"http://isteroidi.it/img/p/1/5/6/156.jpg","name":"HGH-Fragment - 5mg - BIO-PEPTIDE","category":"Peptides","price":39.9,"inStock":true},
  {"id":"336","imageUrl":"http://isteroidi.it/img/p/3/4/7/347.jpg","name":"MOD GRF 1-29 Magnus","category":"Peptides","price":44,"inStock":true},
  {"id":"86","imageUrl":"http://isteroidi.it/img/p/1/0/0/100.jpg","name":"Oxandrolone Durum Elite Pharm 10mg/100 tab.","category":"Oxandrolone","price":90,"inStock":true},
  {"id":"277","imageUrl":"http://isteroidi.it/img/p/2/8/9/289.jpg","name":"BOLDENONE 250 - Boldenone undecylenate 250mg - Magnus","category":"Boldenone undecylenate","price":79,"inStock":true},
  {"id":"28","imageUrl":"http://isteroidi.it/img/p/4/4/44.jpg","name":"Mesviron 25 Genesis (25 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":55,"inStock":true},
  {"id":"221","imageUrl":"http://isteroidi.it/img/p/2/3/2/232.jpg","name":"Nanbol (Nandrolone Decanoate) – XBS Labs","category":"Nandrolone Decanoate","price":85,"inStock":false},
  {"id":"400","imageUrl":"http://isteroidi.it/img/p/8/1/0/810.jpg","name":"Halotestin","category":"Halotestin","price":88.9,"inStock":true},
  {"id":"151","imageUrl":"http://isteroidi.it/img/p/1/6/4/164.jpg","name":"Oxandro Tablets British Dispensary (10 mg/tab) 100 tabs","category":"Oxandrolone","price":91,"inStock":true},
  {"id":"344","imageUrl":"http://isteroidi.it/img/p/6/8/3/683.jpg","name":"RapidteX (drost. Prop. 75mg/ml+ tren ace 75mg/ml.+ test prop 75mg/ml) 225 mg/ml","category":"Home","price":59.9,"inStock":true},
  {"id":"94","imageUrl":"http://isteroidi.it/img/p/1/0/8/108.jpg","name":"Ovigil Sanzyme (1x5000 IU)","category":"Post Cycle Therapy","price":22.9,"inStock":true},
  {"id":"285","imageUrl":"http://isteroidi.it/img/p/2/9/7/297.jpg","name":"TEST C - Testosterone cypionate U.S.P. 250mg - Magnus","category":"Testosterone Cypionate","price":44.99,"inStock":true},
  {"id":"36","imageUrl":"http://isteroidi.it/img/p/5/2/52.jpg","name":"Durabol 100 British Dragon (100 mg/ml) 10 ml","category":"Nandrolone Phenylpropionate","price":24,"inStock":true},
  {"id":"229","imageUrl":"http://isteroidi.it/img/p/2/4/0/240.jpg","name":"Ripbol (Testosterone Propionate, Trenbolone Acetate, Drostanolone Propionate) – XBS Labs","category":"Testosterone Propionate","price":110,"inStock":false},
  {"id":"408","imageUrl":"http://isteroidi.it/img/p/8/2/9/829.jpg","name":"HGH (Recombinant/Liquid)","category":"Buy Human Growth Hormone","price":290.9,"inStock":true},
  {"id":"160","imageUrl":"http://isteroidi.it/img/p/1/7/2/172.jpg","name":"Oxandrolone Tablets Bayer (10 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":89.9,"inStock":false},
  {"id":"352","imageUrl":"http://isteroidi.it/img/p/6/9/1/691.jpg","name":"Eprex 4000IU 6 inj.","category":"Home","price":279.9,"inStock":true},
  {"id":"102","imageUrl":"http://isteroidi.it/img/p/1/1/6/116.jpg","name":"Masteron 100 (MAX PRO), 1000mg / 10ml","category":"Buy Injectable steroids","price":47,"inStock":true},
  {"id":"293","imageUrl":"http://isteroidi.it/img/p/3/0/5/305.jpg","name":"Ligandrol (LGD-4033) - Magnus","category":"SARMs","price":79.9,"inStock":true},
  {"id":"44","imageUrl":"http://isteroidi.it/img/p/6/0/60.jpg","name":"Testabol Enanthate British Dragon (250 mg/ml) 10 ml","category":"Testosterone Enanthate","price":25,"inStock":true},
  {"id":"237","imageUrl":"http://isteroidi.it/img/p/2/4/8/248.jpg","name":"Dianabol Hubei 10mg","category":"Buy Oral Steroids","price":19.99,"inStock":true},
  {"id":"416","imageUrl":"http://isteroidi.it/img/p/8/5/1/851.jpg","name":"Melanotan II 10 mg","category":"Peptides","price":34.9,"inStock":true},
  {"id":"168","imageUrl":"http://isteroidi.it/img/p/1/8/0/180.jpg","name":"Eurochem Masterject 100mg/1ml [10ml vial]","category":"Buy Injectable steroids","price":38,"inStock":true},
  {"id":"360","imageUrl":"http://isteroidi.it/img/p/7/0/0/700.jpg","name":"SIBU-MED (20 MG/60 TABLETS)","category":"Home","price":66.9,"inStock":true},
  {"id":"110","imageUrl":"http://isteroidi.it/img/p/1/2/4/124.jpg","name":"Parabolan Balkan Pharma (100 mg/ml) 1 ml","category":"Buy Injectable steroids","price":7.9,"inStock":true},
  {"id":"301","imageUrl":"http://isteroidi.it/img/p/3/1/4/314.jpg","name":"Adipex Retard - Phenterminum resinatum - 30x","category":"Home","price":89,"inStock":false},
  {"id":"53","imageUrl":"http://isteroidi.it/img/p/6/8/68.jpg","name":"Stanol Body Research (5 mg/tab) 200 tabs","category":"Buy Oral Steroids","price":37,"inStock":true},
  {"id":"245","imageUrl":"http://isteroidi.it/img/p/2/5/6/256.jpg","name":"Deca Durabolin 2ml vial Norma Hellas (100mg/1ml)","category":"Buy Injectable steroids","price":4.9,"inStock":true},
  {"id":"425","imageUrl":"http://isteroidi.it/img/p/8/7/7/877.jpg","name":"Tremilad 150 mg/ml (Trenbolone Mix) 10ml vial","category":"Trenbolone","price":59.9,"inStock":true},
  {"id":"56","imageUrl":"http://isteroidi.it/img/p/7/1/71.jpg","name":"Stanozolol LA Pharma (5 mg/tab) 200 tabs","category":"Buy Oral Steroids","price":35,"inStock":true},
  {"id":"248","imageUrl":"http://isteroidi.it/img/p/2/5/9/259.jpg","name":"Clomid (Clomiphene Citrate) Anfarm Hellas - 50mg - 24 Tablets","category":"Post Cycle Therapy","price":33.99,"inStock":true},
  {"id":"428","imageUrl":"http://isteroidi.it/img/p/8/9/0/890.jpg","name":"Nandecos 200 mg/ml (Nandrolone Decanoate) 10ml vial","category":"Nandrolone Decanoate","price":39.9,"inStock":true},
  {"id":"179","imageUrl":"http://isteroidi.it/img/p/1/9/1/191.jpg","name":"Masterbol 150, Drostanolone Dipropionate, European Pharmaceutical, 150mg/10ml","category":"Drostanolone Propionate","price":36,"inStock":true},
  {"id":"371","imageUrl":"http://isteroidi.it/img/p/7/2/3/723.jpg","name":"Drostanolone Enanthate","category":"Home","price":48.6,"inStock":true},
  {"id":"122","imageUrl":"http://isteroidi.it/img/p/1/3/5/135.jpg","name":"Trenbolone Acetate March (100 mg/ml) 1 ml","category":"Trenbolone","price":6.9,"inStock":true},
  {"id":"315","imageUrl":"http://isteroidi.it/img/p/3/2/5/325.jpg","name":"​​Jintropin 12 i.u.  China Injection","category":"Buy Human Growth Hormone","price":45.99,"inStock":true},
  {"id":"64","imageUrl":"http://isteroidi.it/img/p/7/9/79.jpg","name":"Clenbuterol Sopharma (0,02 mg/tab) 100 tabs","category":"Buy Oral Steroids","price":19,"inStock":true},
  {"id":"256","imageUrl":"http://isteroidi.it/img/p/2/6/7/267.jpg","name":"Cypionate LA Pharma 1ml vial [200mg/1ml]","category":"Buy Injectable steroids","price":5.1,"inStock":true},
  {"id":"436","imageUrl":"http://isteroidi.it/img/p/9/2/4/924.jpg","name":"Stanos 10 mg (Stanozolol, Winstrol)","category":"Stanozolol Injection","price":30,"inStock":true},
  {"id":"187","imageUrl":"http://isteroidi.it/img/p/1/9/9/199.jpg","name":"Winibol, Stanozolol, European Pharmaceutical","category":"Buy Oral Steroids","price":39,"inStock":true},
  {"id":"379","imageUrl":"http://isteroidi.it/img/p/7/5/0/750.jpg","name":"Trenbolone Hexahydrobenzylcarbonate / Parabolan","category":"Trenbolone","price":59.9,"inStock":true},
  {"id":"130","imageUrl":"http://isteroidi.it/img/p/1/4/3/143.jpg","name":"Proviron Hubei (25 mg/tab) 30 tabs","category":"Post Cycle Therapy","price":21,"inStock":true}
]

const productDescriptions: Record<string, string> = {
  '57': "Sculpt a masterpiece of lean, defined muscle. Oxandrolone, famously known as Anavar, is the premier compound for athletes seeking quality gains without water retention. Ideal for cutting cycles or for female athletes seeking a significant yet safe anabolic edge. Forge your legend with unparalleled purity from LA Pharma.",
  '249': "Carve out a physique of granite-like hardness with Winstrol Depot by DESMA. This legendary compound is a staple in pre-contest cycles for its ability to deliver dry, vascular gains while dramatically boosting strength and performance. Perfect for athletes who demand definition without the bulk.",
  '429': "Unleash a new level of endurance and achieve rock-solid, quality muscle with Boldelad 250. This versatile compound, also known as Equipoise, is renowned for its ability to deliver steady, sustainable gains and dramatic increases in vascularity. By boosting red blood cell production, Boldelad enhances oxygen delivery, pushing your performance beyond its limits. Perfect for lean bulks and cutting cycles where quality and definition are paramount.",
  '180': "Build a foundation of pure, quality mass with Nandrobol 250. As a premium Nandrolone Decanoate, it's the cornerstone of bulking cycles for its ability to promote significant muscle growth and provide therapeutic joint support. Experience steady, sustainable gains with a trusted classic.",
  '372': "The timeless mass builder. Nandrolone Decanoate is essential for any serious off-season athlete. Known for adding significant size and strength while also alleviating joint pain from heavy lifting. A foundational compound for transforming your physique.",
  '123': "Achieve the pinnacle of muscle definition with Drostanolone Propionate. Known as Masteron, this is the ultimate finishing compound for a hard, dry, and dense physique. It excels in cutting cycles, helping to shed the last layer of fat while preserving strength and muscle.",
  '316': "Unlock your growth potential with Riptropin HGH. This potent Human Growth Hormone formula is engineered for athletes seeking enhanced recovery, accelerated fat loss, and superior lean muscle gains. Elevate your body's natural capabilities and redefine your limits.",
  '65': "Optimize your performance in all aspects of life. Cialis is the trusted choice for enhancing male vitality and ensuring you're ready for any challenge. A key component for overall well-being and confidence.",
  '257': "Experience rapid results with LA Pharma's Testosterone Propionate. This fast-acting ester is ideal for cutting cycles, delivering lean muscle gains and strength with minimal water retention. Perfect for athletes who demand precise control and a defined physique.",
  '437': "Build quality, lean muscle without the bloat. Turinadyn (Turinabol) is the athlete's choice for steady, clean gains in strength and mass. It bridges the gap between raw power and refined definition, making it a versatile tool for any cycle.",
  '8': "For those who demand rapid and explosive gains, Methandienone Injection is the answer. This potent form of Dianabol delivers dramatic increases in mass and strength, kick-starting your cycle into a higher gear from day one. Unleash raw power.",
  '188': "Refine your physique with Oxanbol. This high-purity Oxandrolone from European Pharmaceutical is the gold standard for lean, quality muscle gains. Perfect for cutting phases where definition is key, or for athletes seeking strength without bulk.",
  '380': "Forge a physique of raw power and unparalleled definition with Trenbolone Enanthate. This long-acting ester provides sustained, powerful results, promoting massive strength gains and significant muscle hardness. The choice for a truly transformative cycle.",
  '131': "Unleash primal strength with Halotestin. This is one of the most potent oral compounds for raw power and aggression, used by elite strength athletes to shatter records. It provides an immediate, intense boost in strength without adding weight, making it the ultimate pre-competition tool.",
  '324': "Amplify your body's natural growth signals with this potent peptide blend. CJC-1295 combined with Ipamorelin creates a powerful synergy, promoting a strong and consistent release of growth hormone. Ideal for lean muscle gain, enhanced recovery, and fat loss.",
  '74': "The king of oral mass builders. Danabol from Balkan Pharma is a high-potency Methandienone (Dianabol) designed for explosive gains in size and strength. A legendary kick-starter for any serious bulking cycle.",
  '265': "Harness the power of four testosterones in one with Sustanon 250. This intelligent blend provides both a rapid and a sustained release of testosterone, ensuring stable, powerful anabolic support for mass, strength, and vitality throughout your cycle.",
  '16': "Experience the pinnacle of testosterone blends with Mix Products by Genesis. This Sustanon-like formula combines multiple esters to provide an immediate surge and sustained release of anabolic power, making it a versatile foundation for any mass-building cycle.",
  '209': "Sculpt a powerful and defined physique with Finarex 200. This high-potency Trenbolone Enanthate from Thaiger Pharma is engineered for advanced athletes seeking dramatic improvements in muscle hardness, strength, and body composition.",
  '388': "Secure your gains and restore balance with Clomiphene Citrate. An essential component of any Post Cycle Therapy (PCT) protocol, it effectively stimulates natural testosterone production, helping you maintain muscle and hormonal health after your cycle.",
  '139': "Optimize your growth hormone output with CJC-1295 from BIO-PEPTIDE. This advanced peptide stimulates the pituitary gland for a sustained release of GH, aiding in muscle growth, fat loss, and improved recovery. A scientific approach to anabolism.",
  '332': "Target localized muscle growth and accelerate repair with IGF1-LR3. This powerful peptide is a long-acting variant of Insulin-Like Growth Factor-1, directly promoting hyperplasia (new muscle cell creation). The ultimate tool for breaking through plateaus.",
  '82': "Build a powerful foundation with Cypionate 300 from Elite Pharm. This high-dose Testosterone Cypionate is the gold standard for any mass-building or performance-enhancing cycle, delivering significant gains in size, strength, and recovery.",
  '273': "Accelerate your body's natural healing processes with TB-500. This remarkable peptide is renowned for its ability to promote rapid recovery from injury, reduce inflammation, and improve flexibility. Essential for the longevity and performance of any serious athlete.",
  '24': "Carve out a lean, hard physique with Genesis Stanozolol. A premium oral Winstrol, it's the perfect tool for cutting cycles, promoting vascularity and strength without water retention. Achieve a polished, stage-ready look.",
  '217': "Achieve superior muscle quality with Pribol. This Methenolone Enanthate (Primobolan) from XBS Labs is the choice for athletes seeking lean, sustainable gains with a high degree of safety. Ideal for cutting cycles and preserving mass.",
  '396': "Enhance the effectiveness of your cycle with Mesterolone (Proviron). This unique compound helps to reduce estrogenic side effects, increase androgenic potency, and improve muscle hardness. A strategic addition for a more defined and powerful physique.",
  '147': "Naturally boost your growth hormone levels with Sermorelin Acetate. This peptide safely stimulates your pituitary gland, leading to benefits like increased lean body mass, reduced body fat, and enhanced recovery, without shutting down natural production.",
  '340': "Prioritize recovery and mental well-being with Xanax. For the high-strung athlete, managing stress and ensuring quality sleep is crucial for growth. This is a tool for ensuring your nervous system recovers as hard as your muscles do.",
  '90': "Ignite your metabolism and torch body fat with Clenbuterol from Elite Pharm. This powerful thermogenic agent is a staple in cutting cycles for its ability to significantly increase metabolic rate and promote rapid fat loss while preserving muscle.",
  '281': "Experience the ultimate anabolic power with TRI-TRENBOLONE 200 by Magnus. This potent blend combines three different trenbolone esters for an immediate, powerful, and sustained effect. For the most advanced athletes seeking unparalleled gains in hardness, strength, and definition.",
  '32': "Protect your physique and optimize your cycle with Tamoxifen Citrate. As a trusted SERM, it's a vital tool for preventing estrogenic side effects like gynecomastia and is a cornerstone of effective Post Cycle Therapy (PCT).",
  '225': "Build a foundation of quality muscle with Enabol. This Testosterone Enanthate from XBS Labs provides the reliable, powerful anabolic support needed for significant gains in size and strength. A staple for any serious mass-building cycle.",
  '404': "Restore your natural hormonal axis with HCG 2000IU. Essential for use during and after a cycle to stimulate natural testosterone production in the testes, preventing testicular atrophy and ensuring a faster recovery.",
  '156': "Harness the classic power of Methandrostenolon. This potent oral steroid, also known as Dianabol, delivers rapid and significant gains in muscle mass and raw strength. The perfect kick-starter to any bulking cycle for immediate, impactful results.",
  '348': "Optimize your body composition with ST Biotropin HGH. This high-purity Somatropin is designed to accelerate fat loss, improve muscle definition, and enhance overall recovery and well-being. A powerful tool for the modern athlete.",
  '98': "Demand precision and a defined look with Propionate 200 from MAX PRO. This high-concentration Testosterone Propionate is engineered for athletes in cutting phases, delivering lean gains and strength with minimal water retention for a sharp, hard physique.",
  '289': "Achieve granite-like muscle hardness with Stanozolol from Magnus Pharmaceuticals. This potent oral Winstrol is a key component for any cutting cycle, promoting a dry, vascular look while boosting strength and performance.",
  '40': "Forge a physique of dense, quality muscle with Trenabol Depot 100. This British Dragon classic delivers the formidable power of Trenbolone, promoting significant strength gains and a hard, defined look that stands apart.",
  '233': "The gold standard for lean, quality gains. Oxanabol from British Dragon provides premium-grade Oxandrolone, perfect for cutting cycles where preserving muscle while shedding fat is paramount. Also an excellent choice for female athletes.",
  '412': "Stimulate a powerful, natural pulse of growth hormone with GHRP-6. This peptide is highly effective at increasing appetite and promoting GH release, making it a superb addition to a bulking cycle for enhanced mass gain and recovery.",
  '164': "Build a commanding physique with DecaJect 200 from Eurochem. This high-quality Nandrolone Decanoate is a cornerstone for mass building, providing substantial gains in size and strength while offering therapeutic support for hardworking joints.",
  '356': "A key hormonal support tool. Progestan provides progesterone, an essential hormone that plays a crucial role in balancing the endocrine system, which can be particularly important during or after complex cycles.",
  '106': "Unleash a versatile anabolic assault with MX 197 by Max Pro. This custom blend is formulated for the advanced athlete, providing a multi-faceted approach to muscle growth, strength, and performance enhancement.",
  '297': "Push the boundaries of muscle growth with YK-11. As a powerful SARM with myostatin-inhibiting properties, YK-11 is researched for its potential to unlock new levels of muscle mass beyond conventional limits. For the experimental, advanced athlete.",
  '48': "For sheer, unadulterated mass and strength, Androlic is the answer. As one of the most powerful oral steroids available, Oxymetholone (Anadrol) delivers explosive gains in size and power, making it the ultimate kick-starter for a bulking cycle.",
  '241': "Accelerate your fat loss and sharpen your definition with Cytomel (T3). This thyroid hormone directly increases your metabolic rate, forcing your body to burn calories at a significantly faster pace. An essential tool for a rapid and effective cutting phase.",
  '421': "The foundation of power. Testos 250 provides high-purity Testosterone Enanthate, the versatile and reliable cornerstone for any cycle. Whether bulking or cutting, it delivers the strength, mass, and vitality you need to dominate your goals.",
  '172': "For the athlete who demands a sharp, defined look. PropioJect 100 from Eurochem is a premium Testosterone Propionate, delivering fast-acting results with minimal water retention. The ideal choice for pre-competition cycles and lean mass phases.",
  '364': "A modern approach to weight management. SAXENDA (Liraglutide) is a powerful tool for controlling appetite and improving insulin sensitivity, making it an effective aid for athletes during a disciplined cutting phase to achieve their weight goals.",
  '114': "Build your foundation of strength and size with Balkan Pharma's Testosterone Cypionate. This high-quality, long-acting testosterone is the gold standard for any cycle, providing consistent, powerful anabolic support for serious muscle growth.",
  '308': "Experience the pinnacle of Human Growth Hormone therapy with Norditropin SimpleXx. This pharmaceutical-grade HGH is renowned for its purity and effectiveness in promoting fat loss, lean muscle growth, and unparalleled recovery.",
  '117': "Achieve rapid, quality gains with Nandrolona F. This fast-acting Nandrolone Phenylpropionate (NPP) from Balkan Pharma is perfect for lean mass cycles, providing the benefits of Deca with less water retention and faster results.",
  '311': "Elevate your physique with Omnitrope, a pharmaceutical-grade Somatropin. This premium Human Growth Hormone is a powerful agent for accelerating fat loss, improving recovery, and building high-quality, dense muscle tissue.",
  '60': "The original intelligent testosterone blend. Sustanon 250 from Organon Pakistan combines four esters to provide an immediate yet sustained release of testosterone, ensuring stable and powerful support for muscle growth, strength, and well-being.",
  '252': "Build quality mass with the added benefit of joint support. Deca-Nan by LA Pharma is a potent Nandrolone Decanoate, perfect for off-season cycles where substantial gains in size and strength are the primary goal.",
  '432': "Achieve a masterfully sculpted physique with Primos 100. This high-quality Methenolone Enanthate (Primobolan) is the definitive choice for lean, dry muscle gains and is a staple in cutting cycles for preserving mass while shedding fat.",
  '183': "Kick-start your cycle with the raw power of Stenobol 100. This injectable Methandienone from European Pharmaceutical delivers rapid and dramatic gains in both muscle mass and strength, setting the stage for a successful bulk.",
  '375': "The cornerstone of any powerful cycle. Testosterone Cypionate is the gold standard for athletes seeking significant gains in muscle mass, strength, and overall performance. A reliable and effective foundation for achieving your physique goals.",
  '126': "A staple for any serious bulking phase. This Nandrolone Decanoate from March Pharmaceuticals delivers steady, quality muscle gains while providing renowned therapeutic relief for joints under heavy strain. Build mass that lasts.",
  '319': "Unlock your genetic potential with Follistatin from Magnus. This powerful protein acts to inhibit myostatin, a key limiter of muscle growth. For the advanced athlete looking to push beyond their natural boundaries and achieve unprecedented muscle mass.",
  '69': "The essential tool for cycle support and recovery. Tamoxifen (Nolvadex) is a trusted Selective Estrogen Receptor Modulator (SERM) used to prevent estrogen-related side effects and is a critical component of any effective Post Cycle Therapy (PCT) plan.",
  '260': "Unleash explosive power and mass with LA Pharma's Oxymetholone. Known as Anadrol, this is one of the most potent oral compounds for kick-starting a cycle, delivering rapid and dramatic gains in size and strength from the very first week.",
  '11': "For the athlete who prioritizes quality over quantity. Primobolan Injection by Genesis is the ultimate choice for lean, dry gains. This high-purity Methenolone Enanthate helps you build and preserve muscle during a cutting phase, without water retention.",
  '192': "Harness the dual power of Turinabol and Methyltestosterone. This unique oral combination from European Pharmaceutical is designed for the athlete seeking both quality muscle gains and a significant boost in aggression and strength for peak performance.",
  '383': "The ultimate pre-contest formula. Cut Stack is an intelligent blend of fast-acting compounds like Testosterone Propionate, Trenbolone Acetate, and Masteron. It's engineered to deliver maximum muscle hardness, vascularity, and fat loss for a stage-ready physique.",
  '134': "Achieve a lean, sculpted physique with Anavar from Hubei. This premium Oxandrolone is renowned for its ability to promote strength and quality muscle gains with zero water retention, making it a top choice for cutting cycles and female athletes.",
  '327': "Enhance cognitive function and reduce anxiety with Selank. This nootropic peptide is used by high-performance individuals to improve mental clarity, reduce stress, and promote a state of calm focus, ensuring your mental game is as strong as your physical one.",
  '77': "A high-octane testosterone blend for the serious athlete. Sustanon 300 from Elite Pharm delivers a powerful, multi-ester formula for sustained, high levels of testosterone. The definitive foundation for maximum mass and strength gains.",
  '268': "Ensure peak performance when it matters most. Viagra 100 by Pfizer is the globally trusted solution for male enhancement, providing reliable and powerful results to boost confidence and vitality.",
  '19': "The bedrock of countless successful cycles. Testosterone Cypionate from Genesis provides a high-quality, long-acting testosterone base, essential for driving significant growth in muscle mass, strength, and overall athletic performance.",
  '212': "Build a powerful physique with Cytex 250. This premium Testosterone Cypionate from Thaiger Pharma provides the long-acting, potent anabolic support needed for substantial gains in size and strength, making it a cornerstone for any mass-building cycle.",
  '391': "Fine-tune your metabolism for rapid fat loss with T4 (Levothyroxine). This thyroid hormone helps to upregulate your body's energy expenditure, making it a powerful tool in an advanced cutting cycle to achieve extreme levels of leanness.",
  '142': "Stimulate a potent, clean pulse of growth hormone with GHRP-6. This peptide is highly effective for increasing GH levels, which can lead to improved recovery, muscle growth, and fat loss. Often used to enhance appetite during bulking phases.",
  '335': "For a sustained elevation in growth hormone, CJC-1295 DAC is the ultimate peptide tool. The DAC (Drug Affinity Complex) extends its half-life, providing a continuous 'GH bleed' that promotes an anabolic environment ideal for fat loss and lean muscle gain.",
  '85': "Carve out a physique of unparalleled hardness and definition. Trebolone Acetate 150 from Elite Pharm is a high-potency, fast-acting form of Trenbolone, delivering dramatic strength gains and a dry, vascular look. The choice of champions.",
  '276': "The connoisseur's choice for lean muscle. PRIMOBOLAN by Magnus is a premium Methenolone Enanthate, revered for its ability to build high-quality, durable muscle tissue with a minimal risk of side effects. Perfect for cutting or lean-bulk cycles.",
  '27': "Unleash raw aggression and neurological drive with Methyltestosterone. This is the ultimate pre-workout tool for strength athletes, providing an immediate and potent boost in power and intensity to shatter personal records.",
  '220': "The legendary Parabolan. This Trenbolone Hexahydrobenzylcarbonate from XBS Labs is revered for its potent ability to completely transform a physique, delivering incredible gains in lean mass, hardness, and strength with a sustained release.",
  '399': "Build quality muscle and strength without the bloat. Turinabol is the thinking athlete's oral steroid, providing steady, clean, and sustainable gains. It's the perfect compound for lean mass phases or as a powerful addition to a cutting stack.",
  '150': "Rekindle the flame with PT-141 (Bremelanotide). This unique peptide works through the nervous system to directly enhance libido and sexual function in both men and women, offering a powerful tool for restoring vitality.",
  '343': "A synergistic powerhouse for mass building. BlendoteX combines the proven muscle-building properties of Nandrolone Decanoate with the foundational power of Testosterone Enanthate in one convenient vial, streamlining your bulking protocol.",
  '93': "A true classic for a reason. Anabol Tablets (Dianabol) from British Dispensary deliver rapid gains in mass and strength. The perfect oral to kick-start a bulking cycle and quickly add size to your frame.",
  '284': "The gold standard testosterone blend, perfected by Magnus. SUSTANON 250 provides a balanced, multi-ester formula to ensure fast-acting and long-lasting testosterone levels, creating the ideal anabolic environment for growth and performance.",
  '35': "The foundation of mass. Decabol 250 is British Dragon's high-purity Nandrolone Decanoate, a legendary compound for building substantial muscle size and strength while also providing therapeutic relief to joints under heavy loads.",
  '228': "A multi-pathway assault on body fat. Clebol by XBS Labs combines the thermogenic power of Albuterol with the targeted fat-mobilizing effects of Yohimbine, creating a synergistic formula for rapid and effective fat loss during a cutting phase.",
  '407': "Reliable, long-lasting performance enhancement. Tadalafil (Cialis) offers a prolonged window of effect, ensuring you are ready to perform at your peak, boosting confidence and stamina when it matters most.",
  '159': "Pharmaceutical-grade quality for a championship physique. Stanozolol from Bayer is a premium choice for athletes seeking to maximize muscle hardness, vascularity, and strength during a cutting cycle, without unwanted water retention.",
  '351': "For powerful and effective acne treatment. ROACCUTANE is a clinical-strength solution for severe acne, often used by athletes to combat androgenic side effects and maintain clear, healthy skin.",
  '101': "The elite choice for lean muscle preservation and growth. Primobolan 100 from MAX PRO delivers high-potency Methenolone Enanthate, perfect for crafting a high-quality, defined physique with minimal risk and maximum results.",
  '292': "The ultimate oral for lean, powerful gains. TURINABOL by Magnus provides pure 4-Chlorodehydromethyltestosterone for athletes who demand quality muscle growth and strength increases without the water retention of traditional bulkers.",
  '43': "Build a strong, dense physique with Testabol Depot. This high-quality Testosterone Propionate from British Dragon is a fast-acting ester, ideal for lean mass cycles and pre-contest preparation where definition and muscle quality are paramount.",
  '236': "Pure, unadulterated Stanozolol for strength and definition. Stanol 50mg is a potent oral for athletes looking to increase performance, hardness, and vascularity without adding significant mass. A classic cutting agent.",
  '415': "Target and accelerate muscle repair with PEG MGF. This modified Mechano Growth Factor is designed for localized administration, helping to speed up recovery and stimulate growth directly in the trained muscle tissue after intense workouts.",
  '167': "Unleash the power of Trenbolone with TrenaJect 75 from Eurochem. This fast-acting Trenbolone Acetate is a formidable tool for achieving rapid gains in strength, muscle hardness, and overall body recomposition. For the serious athlete only.",
  '359': "Elevate your mental game with Ultimate Nootropic Booster. This 'Brain Food' is formulated for the elite athlete who understands that focus, clarity, and cognitive function are just as important as physical strength for achieving peak performance.",
  '109': "The classic mass builder from a trusted name. Nandrolona D by Balkan Pharma delivers potent Nandrolone Decanoate, the cornerstone of off-season cycles for its ability to pack on size and strength while supporting joint health.",
  '300': "A powerful tool for appetite suppression and weight management. Adipex Retard is a pharmaceutical-grade appetite suppressant designed to aid in significant weight loss as part of a disciplined diet and exercise regimen.",
  '51': "The legendary blue heart tabs. Danabol DS is a high-potency Dianabol, renowned for its ability to produce explosive gains in muscle mass and strength. A cornerstone for any athlete looking to add serious size, fast.",
  '244': "The pinnacle of cutting agents. Primobolan Depot is the injectable form of Methenolone, prized for its ability to build high-quality, lean muscle and preserve it during a stringent diet, all without water retention. For a truly refined physique.",
  '424': "The definitive compound for a shredded, powerful look. Trenacetos 100 provides fast-acting Trenbolone Acetate, delivering dramatic results in muscle hardness, vascularity, and strength. The ultimate tool for body recomposition.",
  '175': "The foundation of American bodybuilding. Cypiobol 250 is a premium Testosterone Cypionate, the long-acting ester favored for its ability to deliver consistent, powerful gains in both muscle size and strength. A reliable staple for any cycle.",
  '367': "Sustain your growth hormone elevation. CJC-1295 DAC from Hilma Biocare features an extended half-life, providing a continuous anabolic signal for enhanced fat loss, recovery, and lean muscle accretion. A modern peptide for the modern athlete.",
  '427': "Achieve a dry, dense, and powerful physique. Drostargos 200 provides the long-acting enanthate ester of Drostanolone (Masteron), perfect for lean bulk or cutting cycles where muscle quality and hardness are the top priority.",
  '178': "Build quality, vascular muscle with Equibol 250. This premium Boldenone Undecylenate is known for delivering steady, sustainable gains in lean mass and a remarkable increase in endurance, making it a versatile choice for any athlete.",
  '370': "A versatile anabolic for steady, quality gains. Boldenone Undecylenate is prized for its ability to increase lean body mass, appetite, and red blood cell count, leading to enhanced endurance and vascularity without significant water retention.",
  '121': "Harness the raw power of Trenbolone Enanthate in a convenient single-dose format. This long-acting Trenbolone from March delivers sustained, powerful effects for dramatic changes in strength and body composition.",
  '314': "The ultimate recovery peptide. TB500 by Magnus is a synthetic version of Thymosin Beta-4, a protein that plays a vital role in healing and repair. It's used by elite athletes to accelerate recovery from injuries and reduce inflammation.",
  '63': "Fast-acting and potent. Testosterony Propionat from Farmak is a classic choice for athletes seeking rapid gains in strength and lean mass with minimal water retention, making it ideal for cutting cycles or pre-competition phases.",
  '255': "For the athlete who demands a sharp, defined look. This injectable Stanozolol (Winstrol) from LA Pharma delivers its powerful muscle-hardening and strengthening effects directly, bypassing the first liver pass for a potent impact on your physique.",
  '435': "The king of strength and mass. Anadrolus delivers pure Oxymetholone, one of the most powerful oral steroids for rapidly increasing size and raw power. The ultimate tool for kick-starting a bulking cycle and shattering plateaus.",
  '186': "The power of three. Trenbol 200 is a potent blend of Trenbolone esters, designed to provide both a fast-acting and sustained release for a dramatic and continuous impact on muscle hardness, strength, and definition.",
  '378': "The original and most trusted testosterone blend. Sustanon is a synergistic mix of four testosterone esters that work together to provide a fast yet prolonged anabolic effect, making it the versatile foundation for any cycle.",
  '129': "Essential for post-cycle recovery. Nolvadex (Tamoxifen) is a critical SERM for preventing estrogenic side effects and restarting your natural testosterone production after a cycle, ensuring you keep your hard-earned gains.",
  '322': "Stimulate a significant growth hormone pulse with GHRP-2. This peptide is known for its powerful effect on GH release, leading to increased muscle mass, improved recovery, and fat loss, though with a more pronounced cortisol/prolactin increase than its GHRP-6 cousin.",
  '72': "The gold standard for thermogenic fat loss. Clenbuterol from Balkan Pharma is a potent beta-2 agonist that revs up your metabolism, helping you burn fat at an accelerated rate while preserving lean muscle. A staple in cutting cycles worldwide.",
  '263': "Premium, high-potency Human Growth Hormone. Hygetropin is a trusted name for athletes seeking the powerful benefits of HGH, including accelerated fat loss, enhanced muscle recovery and growth, and improved skin and joint health.",
  '14': "The heavyweight champion of muscle transformation. Trenbolone Enanthate from Genesis provides a sustained, powerful dose of the king of anabolics, delivering unparalleled gains in strength, muscle hardness, and body recomposition.",
  '207': "Build a formidable physique with Dexxa 250. This high-potency Nandrolone Decanoate from Thaiger Pharma is engineered for serious mass building, providing substantial gains in size and strength along with therapeutic joint support.",
  '386': "The fundamental building block for any cycle. These Testosterone Enanthate ampoules provide a pure, reliable source of the primary male hormone, essential for driving muscle growth, strength, and overall performance.",
  '137': "A potent and cost-effective testosterone source. This Testosterone Enanthate from Iran delivers a powerful anabolic punch, serving as a reliable foundation for any mass-building cycle for athletes around the globe.",
  '330': "Target stubborn fat with precision. HGH Fragment 176-191 is a powerful peptide that stimulates lipolysis without affecting insulin sensitivity, making it a supreme tool for a cutting phase.",
  '80': "For the athlete focused on building quality, lasting mass. Decanoate 250 from Elite Pharm is a premium Nandrolone Decanoate, delivering substantial gains in muscle and strength while providing crucial support and lubrication for hardworking joints.",
  '271': "Enhance control and prolong performance with Dapoxy-60. This is a tool designed to help manage premature ejaculation, boosting confidence and stamina for peak sexual performance.",
  '22': "A powerful tool for weight management. Sibutramine is an appetite suppressant that works by altering neurotransmitters in the brain, helping to control cravings and reduce calorie intake as part of a structured diet plan.",
  '215': "The choice for a dense, hard physique. Massbol provides Drostanolone Propionate (Masteron) from XBS Labs, the essential finishing compound for pre-contest cycles to achieve maximum muscle definition and hardness.",
  '394': "The premier choice for quality over quantity. Oxandrolone (Anavar) is prized for its ability to produce clean, lean muscle gains and significant strength increases with minimal side effects, making it ideal for cutting cycles and female athletes.",
  '145': "Stimulate post-workout recovery and growth with MGF. Mechano Growth Factor is a peptide that plays a crucial role in repairing damaged muscle tissue, making it a powerful tool for enhancing recovery and stimulating new growth.",
  '338': "The exercise mimetic. Aicar is a research peptide known for its ability to significantly boost endurance and fat loss by activating AMPK, a key metabolic regulator. A powerful tool for enhancing cardiovascular performance and body composition.",
  '88': "Explosive growth in a tablet. Methandienone Magma is a high-potency Dianabol from Elite Pharm, designed to deliver rapid and dramatic increases in muscle mass and raw strength. The ultimate kick-starter for your bulking cycle.",
  '279': "The king of sustained anabolic power. Trenbolone Enanthate by Magnus delivers the formidable physique-altering effects of Trenbolone with a long-acting ester, providing weeks of consistent gains in strength and muscle hardness.",
  '30': "The metabolic furnace. T3 (Liothyronine) from Genesis is a powerful thyroid hormone that dramatically accelerates your metabolism, forcing your body to burn through fat stores. A critical component for achieving ultra-low body fat levels.",
  '223': "Build a lean, vascular physique with Bodbol. This Boldenone Undecylenate from XBS Labs is perfect for long, steady cycles, delivering quality muscle gains and enhanced endurance with minimal water retention.",
  '402': "The ultimate in estrogen control. Letrozole is a powerful Aromatase Inhibitor (AI) used to combat and reverse severe estrogenic side effects like gynecomastia. An essential tool for sensitive individuals or during heavy cycles.",
  '153': "A reliable and effective testosterone base. Cypionax provides Testosterone Cypionate, the long-acting ester that serves as the foundation for countless bulking and cutting cycles, delivering consistent gains and performance.",
  '346': "A trusted tool for estrogen management. Nolvaden delivers high-quality Tamoxifen Citrate, a SERM essential for preventing gynecomastia during a cycle and for kick-starting natural hormone production during Post Cycle Therapy (PCT).",
  '96': "Achieve a dry, hard, and vascular look. Winstrol by MAX PRO is a high-potency injectable Stanozolol, perfect for cutting cycles where strength, performance, and muscle definition are the primary goals.",
  '287': "Fast-acting testosterone for a defined physique. TEST P from Magnus is a premium Testosterone Propionate, ideal for cutting cycles due to its rapid effects and minimal water retention. Perfect for achieving a sharp, contest-ready look.",
  '38': "The classic choice for quality, lean mass. Boldabol 200 is British Dragon's high-purity Boldenone Undecylenate, renowned for delivering steady, vascular muscle gains with a significant boost in endurance and appetite.",
  '231': "The legendary oral for mass and power. Methanabol tablets from British Dragon deliver pure Dianabol, the fast-acting compound famous for kick-starting bulking cycles with explosive gains in size and strength.",
  '410': "The master hormone for growth and recovery. This lyophilized (powdered) HGH provides the powerful benefits of Somatropin, including accelerated fat loss, enhanced muscle growth, and improved overall vitality. Reconstitute for maximum potency.",
  '162': "Harness the power of growth with Somatrope. This pharmaceutical-grade Human Growth Hormone is a potent tool for transforming your physique, promoting lean muscle gain, rapid fat loss, and superior recovery.",
  '354': "A convenient and stable way to maintain testosterone levels. TESTOGEL is a transdermal testosterone application, ideal for Hormone Replacement Therapy (HRT) or for athletes seeking a consistent, daily dose of testosterone without injections.",
  '104': "The heavyweight champion of mass building. This ultra-high concentration Nandrolone Decanoate from MAX PRO is designed for the serious athlete on a major bulking cycle, delivering unparalleled potential for size and strength gains.",
  '295': "Selectively target muscle growth with Ostarine (MK-2866). This popular SARM is known for its ability to promote lean muscle gains and prevent muscle wasting with a much lower risk of androgenic side effects compared to traditional steroids.",
  '46': "The ultimate tool for a dry, hard physique. Mastabol 100 is British Dragon's Drostanolone Propionate (Masteron), a premier finishing compound that enhances muscle density and definition while actively helping to reduce body fat.",
  '239': "A classic oral for quality muscle. Primobolan tablets are a mild yet effective anabolic, perfect for athletes seeking lean gains, strength without bulk, and a high degree of safety. An excellent choice for cutting cycles.",
  '418': "Pharmaceutical-grade testosterone from a world-renowned name. Sustanon by Aspen Pharmacy provides the classic four-ester blend for a reliable, multi-stage release of testosterone, ensuring stable and effective anabolic support.",
  '170': "Build a powerful foundation with CypioJect 200. This Testosterone Cypionate from Eurochem is the workhorse for any mass or strength cycle, delivering consistent and potent results week after week.",
  '362': "The anti-aging peptide. Epitalon is a remarkable peptide known for its role in regulating telomerase, which is crucial for cellular longevity. It's used to promote deep, restorative sleep and support overall vitality and rejuvenation.",
  '112': "A powerhouse testosterone blend from a top European lab. Sustamed by Balkan Pharma is a high-purity Sustanon, delivering a fast-acting and long-lasting wave of testosterone for maximal gains in size, strength, and performance.",
  '303': "High-potency Human Growth Hormone for the serious athlete. Humanotrope is designed to deliver a significant dose of Somatropin to accelerate fat loss, enhance recovery, and stimulate the growth of dense, quality muscle tissue.",
  '55': "The definitive oral for a shredded physique. Stanozolol from LA Pharma is a high-quality Winstrol, perfect for cutting cycles. It promotes a hard, dry, and vascular appearance while increasing strength and performance.",
  '247': "Fine-tune your cutting phase with Cytomel T4. This thyroid hormone helps to elevate the body's metabolic rate, increasing calorie expenditure and accelerating fat loss. An advanced tool for achieving peak condition.",
  '309': "The pinnacle of HGH therapy. Genotropin is a pharmaceutical-grade Somatropin from Pfizer, renowned for its unmatched purity and efficacy. It's the ultimate tool for anti-aging, recovery, and body recomposition.",
  '58': "The go-to thermogenic for fat loss. Clenbuterol from LA Pharma is a potent metabolic stimulant that helps athletes shed body fat rapidly while preserving hard-earned muscle mass. A staple in pre-contest protocols.",
  '250': "A classic, long-acting testosterone for steady gains. Testex Elmu Prolongatum is a Testosterone Cypionate variant, providing a sustained release for consistent muscle growth and strength increases over a prolonged cycle.",
  '430': "The legendary, long-acting Trenbolone. Hexos provides Trenbolone Hexahydrobenzylcarbonate (Parabolan), a compound revered for its powerful and sustained effects on muscle mass, hardness, and strength. A truly transformative agent.",
  '181': "The choice of champions for a reason. Parabol 100 is a fast-acting Trenbolone Acetate from European Pharmaceutical, delivering rapid and profound changes in physique, including extreme muscle hardness and strength.",
  '373': "The faster-acting 'Deca'. Nandrolone Phenylpropionate (NPP) offers the same muscle-building and joint-supporting benefits as its decanoate cousin but with a much faster release and less water retention, making it ideal for lean mass cycles.",
  '124': "Achieve steady, quality gains with this Boldenone Undecylenate from March. Known for its ability to increase lean mass, vascularity, and endurance, it's a versatile compound perfect for adding a layer of polished muscle.",
  '317': "A popular and effective choice for HGH therapy. Kigtropin is known for its ability to promote significant fat loss, improve sleep quality, and aid in the development of lean, quality muscle tissue.",
  '66': "The golden standard for performance. Kamagra Gold provides a reliable and potent dose of Sildenafil to enhance blood flow, stamina, and confidence, ensuring you're always at the top of your game.",
  '258': "The premier oral for women and cutting cycles. Primobolan from LA Pharma provides Methenolone Acetate, a mild yet effective anabolic for building lean muscle and strength without the risk of significant side effects or water retention.",
  '438': "An oral cutting agent for a refined physique. Methacetos provides Methenolone Acetate (oral Primobolan), prized for its ability to help preserve lean tissue during a diet and add a high-quality, polished look to the musculature.",
  '9': "The king of mass builders. This high-dose Nandrolone Decanoate from Genesis is the cornerstone of any serious bulking cycle, delivering substantial gains in size and strength while providing unmatched therapeutic relief for joints.",
  '189': "For explosive gains in size and strength, Oxybol is the answer. This European Pharmaceutical grade Oxymetholone (Anadrol) is one of the most powerful orals for kick-starting a mass cycle and rapidly adding power.",
  '381': "The ultimate tool for body recomposition. Trenbolone Acetate is a fast-acting, incredibly potent anabolic that delivers unparalleled results in muscle hardness, fat loss, and strength gains. This is the definition of a 'game-changer'.",
  '132': "Unleash pure, unadulterated aggression and strength. Methyltestosterone is the powerlifter's secret weapon, providing an immediate and intense neurological drive to move maximal weights. Use with precision and purpose.",
  '325': "The peptide for deep, restorative sleep. DSIP (Delta Sleep-Inducing Peptide) is used to promote a more natural and restful sleep architecture, which is critical for hormone production, recovery, and overall well-being.",
  '75': "A legendary oral for a hard, defined look. Strombafort by Balkan Pharma is a high-purity Stanozolol (Winstrol) that excels in cutting cycles, helping to shed water and reveal a sharp, vascular physique while boosting strength.",
  '266': "The ultimate intensity booster for your nightlife. Poppers provide an immediate and powerful rush, heightening sensations and creating an uninhibited experience. For recreational use only.",
  '17': "The master of muscle hardness. Drostanolone by Genesis provides premium Masteron, the essential ingredient for any pre-contest or cutting cycle. It works to dry out the physique, increase muscle density, and reveal a level of detail that stands apart.",
  '210': "The finishing touch for a championship physique. Finexal 100 is Thaiger Pharma's potent Trenbolone Acetate, engineered to deliver extreme muscle hardness, vascularity, and strength in the final stages of contest prep.",
  '389': "Incinerate fat with precision. Clenbuterol from Hilma Biocare is a high-purity thermogenic agent that elevates your metabolic rate, allowing for accelerated fat loss while helping to preserve your hard-earned muscle."
};

const allProducts: Product[] = rawProductData.map(p => ({
    ...p,
    description: productDescriptions[p.id] || `A high-quality ${p.category} product designed for elite performance. Please consult the active substance page for detailed information.`,
    manufacturer: 
        p.name.includes('LA Pharma') ? 'LA Pharma' :
        p.name.includes('Balkan Pharma') ? 'Balkan Pharma' :
        p.name.includes('Genesis') ? 'Genesis' :
        p.name.includes('British Dragon') ? 'British Dragon' :
        p.name.includes('Thaiger Pharma') ? 'Thaiger Pharma' :
        p.name.includes('European Pharmaceutical') ? 'European Pharmaceutical' :
        p.name.includes('Elite Pharm') ? 'Elite Pharm' :
        p.name.includes('Magnus') ? 'Magnus' :
        p.name.includes('March') ? 'March' :
        'Generic Labs'
}));

export const categories = Array.from(new Set(allProducts.map(p => p.category))).sort();

export const manufacturers = Array.from(new Set(allProducts.map(p => p.manufacturer || ''))).filter(Boolean).sort();

export const slugify = (text: string) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const findProductByName = (name: string): Product | undefined => {
  if (!name) return undefined;
  return allProducts.find(p => p.name.toLowerCase() === name.toLowerCase());
};

const SIMULATED_DELAY = 200;

export const eShopService = {
  async fetchProductsByFilter({ type, value }: { type?: string; value?: string }): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!type || !value || value === 'all') {
      return allProducts;
    }
    const slugifiedValue = slugify(value);
    if (type === 'category') {
      return allProducts.filter(p => slugify(p.category) === slugifiedValue);
    }
    if (type === 'manufacturer') {
      return allProducts.filter(p => slugify(p.manufacturer || '') === slugifiedValue);
    }
    return [];
  },

  async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const lowercasedQuery = query.toLowerCase();
    if (!lowercasedQuery) return [];
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(lowercasedQuery) ||
      p.description.toLowerCase().includes(lowercasedQuery) ||
      p.category.toLowerCase().includes(lowercasedQuery)
    );
  },
  
  async findProduct(productName: string): Promise<Product | undefined> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY / 2));
    return findProductByName(productName);
  },

  async fetchProductById(id: string): Promise<Product | undefined> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    return allProducts.find(p => p.id === id);
  },
  
  async fetchProductsByIds(ids: string[]): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    return allProducts.filter(p => ids.includes(p.id));
  },

  async fetchRelatedProducts(product: Product): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  },

  getDisplayTitle(type: 'category' | 'manufacturer', slug: string): string {
    const list = type === 'category' ? categories : manufacturers;
    return list.find(item => slugify(item) === slug) || slug;
  },
  
  async validateDiscountCode(code: string): Promise<{ success: boolean; message: string; discount?: Discount | null; }> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const upperCode = code.toUpperCase();
    if (upperCode === 'FORGE10') {
      return { success: true, message: 'Discount FORGE10 applied! (10% off)', discount: { code: upperCode, percentage: 10 } };
    }
    if (upperCode === 'LEGEND25') {
      return { success: true, message: 'Discount LEGEND25 applied! (25% off)', discount: { code: upperCode, percentage: 25 } };
    }
    return { success: false, message: 'Invalid discount code.' };
  },

  async placeOrderInPrestaShop(cart: CartItem[], shippingAddress: string, discount: Discount | null): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * (discount ? (1 - discount.percentage / 100) : 1);
    const newOrder: Order = {
      id: `PRESTA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: cart,
      total: total,
      shippingAddress: shippingAddress,
      status: 'Processing',
      date: new Date().toISOString(),
      discountApplied: discount || undefined
    };
    return newOrder;
  },

  async checkOrderStatus(orderId: string): Promise<Order | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOrders.find(o => o.id.toLowerCase().includes(orderId.toLowerCase()));
  },
  
  async fetchOrderHistory(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOrders;
  },

  async compareProductsFromPrestaShop(productNames: string[]): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return allProducts.filter(p => productNames.some(name => p.name.toLowerCase() === name.toLowerCase()));
  },
  
  async modifyOrderInPrestaShop(orderId: string, action: 'cancel' | 'changeAddress', newAddress?: string): Promise<{success: boolean; message: string}> {
      await new Promise(resolve => setTimeout(resolve, 500));
      const order = mockOrders.find(o => o.id.toLowerCase().includes(orderId.toLowerCase()));
      if (!order) {
          return { success: false, message: `Order #${orderId} not found.` };
      }
      if (action === 'cancel') {
          if (order.status === 'Processing') {
              order.status = 'Cancelled';
              return { success: true, message: `Order #${orderId} has been cancelled.` };
          }
          return { success: false, message: `Order #${orderId} cannot be cancelled as it has already been ${order.status}.` };
      }
      if (action === 'changeAddress') {
          if (order.status === 'Processing' && newAddress) {
              order.shippingAddress = newAddress;
              return { success: true, message: `Shipping address for order #${orderId} has been updated.` };
          }
          return { success: false, message: `Order #${orderId} address cannot be changed.` };
      }
      return { success: false, message: 'Invalid modification action.' };
  }
};
