/* ===========================================================
   题库 A：数学 / 物理 / 英语
   题型：single 单选、judge 判断、fill 填空
   说明：标注“真题改编”的题目依据唐山各区公开期末试题整理改编，
        用于同区域题型训练，非原始卷面扫描件。
   =========================================================== */
window.BANK = [
  /* ---------------- 数学 ---------------- */
  {id:"m11-1",s:"math",c:"m11",t:"single",lv:1,src:"章节强化",
   stem:"下列长度的三条线段，能组成三角形的是（  ）",
   opts:["1 cm，2 cm，3 cm","2 cm，3 cm，6 cm","3 cm，4 cm，5 cm","4 cm，5 cm，10 cm"],ans:2,
   ana:"判断依据：两条较短边之和大于最长边。A：1+2=3，不成立；B：2+3<6；C：3+4>5，成立；D：4+5<10。"},

  {id:"m11-2",s:"math",c:"m11",t:"single",lv:2,src:"唐山·路北 2024 期末（改编）",real:1,
   stem:"等腰三角形的两边长分别为 3 和 7，则它的周长是（  ）",
   opts:["13","17","13 或 17","10"],ans:1,
   ana:"若 3 为腰，则三边为 3、3、7，3+3<7 不能构成三角形；故 7 为腰，三边为 7、7、3，周长 17。等腰题必须分类后用三边关系检验。"},

  {id:"m11-3",s:"math",c:"m11",t:"judge",lv:2,src:"章节强化",
   stem:"三角形的一个外角大于任何一个内角。",ans:false,
   ana:"外角大于任何一个与它“不相邻”的内角，而与它相邻的内角是它的邻补角，外角大于该内角只在锐角情况下成立，故原说法错误。"},

  {id:"m11-4",s:"math",c:"m11",t:"fill",lv:2,src:"章节强化",
   stem:"一个多边形的内角和是 1080°，则这个多边形是 ______ 边形。",ans:["8","八"],
   ana:"(n−2)×180°=1080°，得 n−2=6，n=8，即八边形。"},

  {id:"m11-5",s:"math",c:"m11",t:"single",lv:2,src:"章节强化",
   stem:"在 △ABC 中，∠A∶∠B∶∠C=1∶2∶3，则 △ABC 是（  ）",
   opts:["锐角三角形","直角三角形","钝角三角形","等腰三角形"],ans:1,
   ana:"设三份分别为 x、2x、3x，则 x+2x+3x=180°，x=30°，最大角 ∠C=90°，故为直角三角形。"},

  {id:"m12-1",s:"math",c:"m12",t:"single",lv:1,src:"章节强化",
   stem:"下列条件中，不能判定两个三角形全等的是（  ）",
   opts:["SSS","SAS","SSA","AAS"],ans:2,
   ana:"SSA（两边及其中一边的对角）无法唯一确定三角形形状，不能作为全等判定依据。"},

  {id:"m12-2",s:"math",c:"m12",t:"single",lv:3,src:"唐山·路南 2023 期末（改编）",real:1,
   stem:"已知 AB=DE，∠B=∠DEF，添加下列条件后仍不能判定 △ABC≌△DEF 的是（  ）",
   opts:["BC=EF","∠A=∠D","AC=DF","∠ACB=∠F"],ans:2,
   ana:"AC=DF 是“两边及其中一边的对角”，属 SSA，不能判定全等；其余分别为 SAS、ASA、AAS。"},

  {id:"m12-3",s:"math",c:"m12",t:"judge",lv:1,src:"章节强化",
   stem:"角的平分线上的点到角两边的距离相等，这里的“距离”指垂线段的长度。",ans:true,
   ana:"点到直线的距离定义为垂线段长度，因此使用该性质时必须作出垂线并标注垂直符号。"},

  {id:"m12-4",s:"math",c:"m12",t:"fill",lv:1,src:"章节强化",
   stem:"判定两个直角三角形全等，除 SAS、ASA、AAS、SSS 外，还有一种方法是 ______。",ans:["HL","hl","H.L."],
   ana:"HL 指斜边和一条直角边对应相等，是直角三角形特有的判定方法。"},

  {id:"m12-5",s:"math",c:"m12",t:"single",lv:2,src:"章节强化",
   stem:"若 △ABC≌△DEF，∠A=50°，∠B=70°，则 ∠F 的度数是（  ）",
   opts:["50°","60°","70°","80°"],ans:1,
   ana:"∠C=180°−50°−70°=60°，由全等三角形对应角相等得 ∠F=∠C=60°。"},

  {id:"m13-1",s:"math",c:"m13",t:"single",lv:1,src:"章节强化",
   stem:"下列图形中，不是轴对称图形的是（  ）",
   opts:["等腰三角形","平行四边形","正五边形","线段"],ans:1,
   ana:"平行四边形是中心对称图形，但不是轴对称图形；其余三个都能找到对称轴。"},

  {id:"m13-2",s:"math",c:"m13",t:"single",lv:3,src:"唐山·丰南 2024 期中（改编）",real:1,
   stem:"等腰三角形有一个角是 80°，则它的顶角是（  ）",
   opts:["80°","20°","80° 或 20°","100°"],ans:2,
   ana:"80° 可能是顶角，此时顶角 80°；也可能是底角，此时顶角 = 180°−2×80° = 20°。两种情况都要保留。"},

  {id:"m13-3",s:"math",c:"m13",t:"judge",lv:2,src:"章节强化",
   stem:"到线段两端距离相等的点，在这条线段的垂直平分线上。",ans:true,
   ana:"这是线段垂直平分线的判定定理，常用来证明“点在垂直平分线上”或作对称点。"},

  {id:"m13-4",s:"math",c:"m13",t:"fill",lv:2,src:"章节强化",
   stem:"在直角三角形中，30° 角所对的直角边长为 4 cm，则斜边长为 ______ cm。",ans:["8"],
   ana:"30° 角所对的直角边等于斜边的一半，故斜边 = 4×2 = 8 cm。"},

  {id:"m13-5",s:"math",c:"m13",t:"single",lv:3,src:"章节强化",
   stem:"等边三角形一边上的高为 3√3，则它的边长为（  ）",
   opts:["3","6","9","12"],ans:1,
   ana:"等边三角形的高 = (√3/2)×边长，故边长 = 3√3 ÷ (√3/2) = 6。"},

  {id:"m14-1",s:"math",c:"m14",t:"single",lv:1,src:"章节强化",
   stem:"计算 a³·a⁴ 的结果是（  ）",
   opts:["a⁷","a¹²","a","a⁴³"],ans:0,
   ana:"同底数幂相乘，底数不变、指数相加：a³·a⁴ = a³⁺⁴ = a⁷。"},

  {id:"m14-2",s:"math",c:"m14",t:"single",lv:2,src:"章节强化",
   stem:"下列各式中，能用平方差公式计算的是（  ）",
   opts:["(a+b)(b+a)","(a−b)(−a+b)","(a+b)(a−b)","(a−b)²"],ans:2,
   ana:"平方差公式要求“一项相同、一项互为相反数”。A、D 是完全平方，B 两项都互为相反数。"},

  {id:"m14-3",s:"math",c:"m14",t:"fill",lv:1,src:"章节强化",
   stem:"分解因式：x²−9 = ______。",ans:["(x+3)(x-3)","(x-3)(x+3)","（x+3）（x-3）"],
   ana:"9=3²，符合平方差公式 a²−b²=(a+b)(a−b)，故 x²−9=(x+3)(x−3)。"},

  {id:"m14-4",s:"math",c:"m14",t:"single",lv:2,src:"唐山·开平 2024 期末（改编）",real:1,
   stem:"计算 (2x−1)² 的结果是（  ）",
   opts:["4x²−1","4x²−4x+1","2x²−4x+1","4x²+4x+1"],ans:1,
   ana:"完全平方公式：(2x)²−2·2x·1+1²=4x²−4x+1，中间项不能漏。"},

  {id:"m14-5",s:"math",c:"m14",t:"judge",lv:1,src:"章节强化",
   stem:"(a+b)² = a²+b²。",ans:false,
   ana:"完全平方公式为 (a+b)²=a²+2ab+b²，漏掉中间项 2ab 是最常见错误。"},

  {id:"m14-6",s:"math",c:"m14",t:"fill",lv:3,src:"章节强化",
   stem:"若 a+b=5，ab=6，则 a²+b² = ______。",ans:["13"],
   ana:"a²+b²=(a+b)²−2ab=25−12=13。"},

  {id:"m15-1",s:"math",c:"m15",t:"single",lv:1,src:"章节强化",
   stem:"分式 (x−1)/(x+2) 有意义的条件是（  ）",
   opts:["x≠1","x≠−2","x≠2","x≠−1"],ans:1,
   ana:"分式有意义的条件是分母不为 0，即 x+2≠0，x≠−2。"},

  {id:"m15-2",s:"math",c:"m15",t:"single",lv:2,src:"章节强化",
   stem:"若分式 (x²−1)/(x+1) 的值为 0，则 x 的值是（  ）",
   opts:["1","−1","±1","0"],ans:0,
   ana:"需分子=0 且分母≠0。分子为 0 得 x=±1；分母 x+1≠0 排除 x=−1，故 x=1。"},

  {id:"m15-3",s:"math",c:"m15",t:"fill",lv:2,src:"章节强化",
   stem:"解分式方程 1/(x−1) = 2/x，得 x = ______。",ans:["2"],
   ana:"去分母得 x=2(x−1)，解得 x=2；检验 x=2 时两分母均不为 0，故 x=2 是原方程的解。"},

  {id:"m15-4",s:"math",c:"m15",t:"judge",lv:2,src:"章节强化",
   stem:"解分式方程时必须检验，因为去分母可能产生增根。",ans:true,
   ana:"去分母时两边同乘了含未知数的式子，可能使原分母为 0，故必须把根代回原方程检验。"},

  {id:"m15-5",s:"math",c:"m15",t:"fill",lv:1,src:"章节强化",
   stem:"计算：2⁻² = ______。",ans:["1/4","0.25","¼"],
   ana:"a⁻ⁿ = 1/aⁿ（a≠0），故 2⁻² = 1/2² = 1/4。"},

  /* ---------------- 物理 ---------------- */
  {id:"p1-1",s:"physics",c:"p1",t:"single",lv:1,src:"章节强化",
   stem:"一辆汽车以 72 km/h 的速度行驶，这个速度合（  ）",
   opts:["7.2 m/s","20 m/s","72 m/s","259.2 m/s"],ans:1,
   ana:"1 m/s = 3.6 km/h，故 72 km/h ÷ 3.6 = 20 m/s。"},

  {id:"p1-2",s:"physics",c:"p1",t:"single",lv:1,src:"章节强化",
   stem:"小明坐在行驶的汽车里，他说自己是静止的，他选择的参照物是（  ）",
   opts:["路面","路旁的树木","汽车座椅","迎面驶来的汽车"],ans:2,
   ana:"小明相对座椅位置不变，故选座椅为参照物时他是静止的；相对路面、树木则是运动的。"},

  {id:"p1-3",s:"physics",c:"p1",t:"fill",lv:2,src:"唐山·路北 2024 期末（改编）",real:1,
   stem:"用刻度尺测得某物体长度为 2.35 cm，则该刻度尺的分度值是 ______。",ans:["1mm","1 mm","0.1cm","0.1 cm","毫米"],
   ana:"读数要估读到分度值的下一位。2.35 cm 中最后一位“5”是估读位，故分度值为 0.1 cm = 1 mm。"},

  {id:"p1-4",s:"physics",c:"p1",t:"judge",lv:2,src:"章节强化",
   stem:"变速运动的平均速度等于各段速度的平均值。",ans:false,
   ana:"平均速度 = 总路程 ÷ 总时间，不是各段速度的算术平均值（快慢段耗时不同，权重不同）。"},

  {id:"p1-5",s:"physics",c:"p1",t:"fill",lv:2,src:"章节强化",
   stem:"一辆汽车以 15 m/s 的速度匀速行驶 2 min，通过的路程是 ______ m。",ans:["1800"],
   ana:"t = 2 min = 120 s，s = vt = 15×120 = 1800 m。"},

  {id:"p2-1",s:"physics",c:"p2",t:"single",lv:1,src:"章节强化",
   stem:"关于声现象，下列说法正确的是（  ）",
   opts:["真空也能传声","声音是由物体振动产生的","声速在空气中比在水中大","振动停止，已经发出的声音立即消失"],ans:1,
   ana:"声由振动产生，传播需要介质；一般 v固>v液>v气；振动停止只是不再发声，已发出的声波仍会传播。"},

  {id:"p2-2",s:"physics",c:"p2",t:"single",lv:1,src:"章节强化",
   stem:"“闻其声而知其人”，主要依据的是声音的（  ）",
   opts:["音调","响度","音色","频率"],ans:2,
   ana:"不同发声体的材料和结构不同，音色不同，故能辨人。"},

  {id:"p2-3",s:"physics",c:"p2",t:"fill",lv:1,src:"章节强化",
   stem:"15 ℃ 时空气中的声速约为 ______ m/s。",ans:["340"],
   ana:"15 ℃ 空气中声速约 340 m/s，是回声测距计算的常用取值。"},

  {id:"p2-4",s:"physics",c:"p2",t:"judge",lv:1,src:"章节强化",
   stem:"超声波的频率高于 20000 Hz，人耳听不到。",ans:true,
   ana:"人耳听觉范围约为 20 Hz~20000 Hz，高于 20000 Hz 为超声波，低于 20 Hz 为次声波。"},

  {id:"p2-5",s:"physics",c:"p2",t:"single",lv:2,src:"唐山·路南 2023 期末（改编）",real:1,
   stem:"下列控制噪声的措施中，属于在传播过程中减弱噪声的是（  ）",
   opts:["摩托车安装消声器","在道路两旁植树","工人在车间戴耳罩","教室保持安静"],ans:1,
   ana:"植树造林是在传播过程中阻断噪声；消声器属声源处，耳罩属人耳处，保持安静属声源处。"},

  {id:"p3-1",s:"physics",c:"p3",t:"single",lv:1,src:"章节强化",
   stem:"下列物态变化过程中，需要吸热的是（  ）",
   opts:["凝固","液化","升华","凝华"],ans:2,
   ana:"熔化、汽化、升华吸热；凝固、液化、凝华放热。"},

  {id:"p3-2",s:"physics",c:"p3",t:"single",lv:2,src:"章节强化",
   stem:"冰在熔化过程中，下列说法正确的是（  ）",
   opts:["温度不断升高","温度保持不变，需要继续吸热","温度保持不变，不需要吸热","温度不断降低"],ans:1,
   ana:"冰是晶体，有固定熔点，熔化过程温度不变但仍需持续吸热，处于固液共存状态。"},

  {id:"p3-3",s:"physics",c:"p3",t:"fill",lv:2,src:"章节强化",
   stem:"夏天从冰箱里取出的饮料瓶，外壁很快出现小水珠，这是 ______ 现象（填物态变化名称）。",ans:["液化"],
   ana:"空气中的水蒸气遇冷放热变成小水珠，属于液化，附着在瓶壁上。"},

  {id:"p3-4",s:"physics",c:"p3",t:"judge",lv:2,src:"章节强化",
   stem:"晶体熔化时温度保持不变，说明晶体熔化不需要吸收热量。",ans:false,
   ana:"温度不变但必须继续吸热，吸收的热量用于破坏晶体结构（状态改变），而非升高温度。"},

  {id:"p3-5",s:"physics",c:"p3",t:"single",lv:3,src:"唐山·丰南 2024 期中（改编）",real:1,
   stem:"用久的白炽灯内壁会变黑，这个过程中先后发生的物态变化是（  ）",
   opts:["升华和凝华","汽化和液化","熔化和凝固","升华和液化"],ans:0,
   ana:"钨丝受热升华成钨蒸气，遇冷玻璃壁又凝华成固态钨，附着在内壁使其变黑。"},

  {id:"p4-1",s:"physics",c:"p4",t:"single",lv:1,src:"章节强化",
   stem:"下列现象中，由光的直线传播形成的是（  ）",
   opts:["水中的倒影","墙上的影子","筷子在水面处看起来“折断”","雨后的彩虹"],ans:1,
   ana:"影子是光被不透明物体挡住形成的，属光的直线传播；倒影是反射，折断是折射，彩虹是色散。"},

  {id:"p4-2",s:"physics",c:"p4",t:"single",lv:2,src:"章节强化",
   stem:"入射光线与镜面的夹角为 30°，则反射角是（  ）",
   opts:["30°","60°","90°","120°"],ans:1,
   ana:"入射角是入射光线与法线的夹角 = 90°−30° = 60°，反射角等于入射角，故为 60°。"},

  {id:"p4-3",s:"physics",c:"p4",t:"fill",lv:1,src:"章节强化",
   stem:"平面镜成像时，像与物到镜面的距离 ______（填“相等”或“不相等”）。",ans:["相等"],
   ana:"平面镜所成的像与物体关于镜面对称，故像距等于物距，连线与镜面垂直。"},

  {id:"p4-4",s:"physics",c:"p4",t:"judge",lv:2,src:"章节强化",
   stem:"漫反射不遵守光的反射定律。",ans:false,
   ana:"镜面反射和漫反射都遵守光的反射定律，只是反射面凹凸不平使反射光线射向不同方向。"},

  {id:"p4-5",s:"physics",c:"p4",t:"single",lv:2,src:"章节强化",
   stem:"池水看起来比实际浅，这是因为（  ）",
   opts:["光的反射","光的折射","光的直线传播","光的色散"],ans:1,
   ana:"池底反射的光从水中斜射入空气时发生折射，远离法线，人逆着折射光线看，像的位置比实际偏高。"},

  {id:"p5-1",s:"physics",c:"p5",t:"single",lv:3,src:"唐山·路北 2024 期末（改编）",real:1,
   stem:"凸透镜的焦距为 10 cm，把物体放在距透镜 15 cm 处，所成的像是（  ）",
   opts:["倒立、缩小的实像","倒立、放大的实像","正立、放大的虚像","倒立、等大的实像"],ans:1,
   ana:"f=10 cm，2f=20 cm，物距 15 cm 满足 2f>u>f，成倒立、放大的实像，像距大于 2f（投影仪原理）。"},

  {id:"p5-2",s:"physics",c:"p5",t:"single",lv:1,src:"章节强化",
   stem:"近视眼应佩戴的镜片是（  ）",
   opts:["凸透镜","凹透镜","平面镜","三棱镜"],ans:1,
   ana:"近视眼像成在视网膜前，需用凹透镜使光线发散，让像后移到视网膜上。"},

  {id:"p5-3",s:"physics",c:"p5",t:"fill",lv:2,src:"章节强化",
   stem:"凸透镜焦距为 10 cm，物体放在距透镜 5 cm 处，所成的像是 ______（填像的正倒、大小、虚实）。",ans:["正立放大的虚像","正立、放大的虚像","正立放大虚像","放大正立虚像"],
   ana:"u<f 时成正立、放大的虚像，与物体同侧，是放大镜的成像原理，光屏承接不到。"},

  {id:"p5-4",s:"physics",c:"p5",t:"judge",lv:2,src:"章节强化",
   stem:"显微镜的物镜和目镜都是凸透镜。",ans:true,
   ana:"显微镜物镜成放大的实像，目镜相当于放大镜再成放大的虚像，两次放大，二者均为凸透镜。"},

  {id:"p5-5",s:"physics",c:"p5",t:"single",lv:2,src:"章节强化",
   stem:"照相机的成像原理是（  ）",
   opts:["u>2f，成倒立、缩小的实像","2f>u>f，成倒立、放大的实像","u<f，成正立、放大的虚像","u=2f，成倒立、等大的实像"],ans:0,
   ana:"照相机物距大于二倍焦距，成倒立、缩小的实像，像距在 f 与 2f 之间。"},

  {id:"p6-1",s:"physics",c:"p6",t:"single",lv:1,src:"章节强化",
   stem:"把一块铁切去一半，剩下部分（  ）",
   opts:["质量减半，密度不变","质量减半，密度减半","质量不变，密度减半","质量和密度都不变"],ans:0,
   ana:"密度是物质的特性，与质量、体积无关，故密度不变；质量随物质减少而减半。"},

  {id:"p6-2",s:"physics",c:"p6",t:"single",lv:1,src:"章节强化",
   stem:"水的密度是 1.0×10³ kg/m³，它表示的物理意义是（  ）",
   opts:["1 m³ 水的质量是 1.0×10³ kg","1 kg 水的体积是 1 m³","1 m³ 水的重力是 1.0×10³ N","1 kg 水的密度是 1.0×10³ kg/m³"],ans:0,
   ana:"密度表示单位体积某种物质的质量，故 1 m³ 水的质量为 1.0×10³ kg。"},

  {id:"p6-3",s:"physics",c:"p6",t:"fill",lv:2,src:"章节强化",
   stem:"一块铝的质量为 270 g，体积为 100 cm³，则铝的密度是 ______ g/cm³。",ans:["2.7"],
   ana:"ρ = m/V = 270 g ÷ 100 cm³ = 2.7 g/cm³，合 2.7×10³ kg/m³。"},

  {id:"p6-4",s:"physics",c:"p6",t:"judge",lv:1,src:"章节强化",
   stem:"使用托盘天平时，可以用手直接拿取砝码。",ans:false,
   ana:"必须用镊子夹取砝码，用手直接拿会沾上汗渍油污，导致砝码质量改变、测量不准。"},

  {id:"p6-5",s:"physics",c:"p6",t:"single",lv:2,src:"章节强化",
   stem:"一瓶水倒掉一半后，剩余水的密度（  ）",
   opts:["变小","变大","不变","无法判断"],ans:2,
   ana:"密度由物质种类和状态决定，倒掉一半后质量和体积同时减半，比值不变。"},

  /* ---------------- 英语 ---------------- */
  {id:"e1-1",s:"english",c:"e1",t:"single",lv:1,src:"章节强化",
   stem:"— Where ______ you go on vacation?\n— I went to Beijing.",
   opts:["do","did","are","were"],ans:1,
   ana:"由答语 went 可知是一般过去时，疑问句用助动词 did，后接动词原形 go。"},

  {id:"e1-2",s:"english",c:"e1",t:"single",lv:1,src:"章节强化",
   stem:"She ______ to the science museum with her parents yesterday.",
   opts:["go","goes","went","going"],ans:2,
   ana:"yesterday 是过去时间标志，谓语用过去式 went。"},

  {id:"e1-3",s:"english",c:"e1",t:"fill",lv:1,src:"章节强化",
   stem:"I didn't ______ (buy) anything special for my mother.",ans:["buy"],
   ana:"didn't 后必须接动词原形，故填 buy，不能写成 bought。"},

  {id:"e1-4",s:"english",c:"e1",t:"judge",lv:2,src:"章节强化",
   stem:"“Did you went to the beach?” 是一句正确的英语句子。",ans:false,
   ana:"助动词 did 已表示过去时，后面的实义动词须用原形，应改为 Did you go to the beach?"},

  {id:"e2-1",s:"english",c:"e2",t:"single",lv:1,src:"章节强化",
   stem:"— ______ do you exercise?\n— Twice a week.",
   opts:["How long","How often","How soon","How far"],ans:1,
   ana:"twice a week 表示频率，用 how often 提问。"},

  {id:"e2-2",s:"english",c:"e2",t:"single",lv:2,src:"唐山·路北 2024 期末（改编）",real:1,
   stem:"He ______ goes to the movies — maybe once a month.",
   opts:["always","hardly ever","never","sometimes"],ans:3,
   ana:"once a month 表示“有时”，故选 sometimes；hardly ever 是“几乎不”，never 是“从不”，与 once a month 矛盾。"},

  {id:"e2-3",s:"english",c:"e2",t:"fill",lv:1,src:"章节强化",
   stem:"My father ______ (watch) the news on TV every evening.",ans:["watches"],
   ana:"主语 My father 是第三人称单数，every evening 表示一般现在时，故用 watches。"},

  {id:"e2-4",s:"english",c:"e2",t:"judge",lv:2,src:"章节强化",
   stem:"although 和 but 可以同时出现在同一个英语句子里。",ans:false,
   ana:"although 引导让步状语从句，不能与 but 连用，二者只能保留一个。"},

  {id:"e2-5",s:"english",c:"e2",t:"single",lv:2,src:"章节强化",
   stem:"Eating more vegetables ______ good for your health.",
   opts:["are","is","be","were"],ans:1,
   ana:"动名词短语 Eating more vegetables 作主语，谓语用单数 is。"},

  {id:"e3-1",s:"english",c:"e3",t:"single",lv:1,src:"章节强化",
   stem:"Tina is ______ than her sister.",
   opts:["outgoing","more outgoing","most outgoing","outgoinger"],ans:1,
   ana:"多音节形容词比较级用 more + 原级，且句中有 than。"},

  {id:"e3-2",s:"english",c:"e3",t:"single",lv:2,src:"章节强化",
   stem:"This book is as ______ as that one.",
   opts:["interesting","more interesting","most interesting","interested"],ans:0,
   ana:"as … as 中间用形容词原级，表示“和…一样”。"},

  {id:"e3-3",s:"english",c:"e3",t:"fill",lv:2,src:"章节强化",
   stem:"My hair is longer than ______ (she).",ans:["hers"],
   ana:"比较对象要同类，此处指 her hair，用名词性物主代词 hers。"},

  {id:"e3-4",s:"english",c:"e3",t:"judge",lv:2,src:"章节强化",
   stem:"very 可以用来修饰形容词的比较级，如 very taller。",ans:false,
   ana:"very 只能修饰原级；修饰比较级应用 much、far、a lot、even、a little 等。"},

  {id:"e3-5",s:"english",c:"e3",t:"single",lv:2,src:"唐山·路南 2023 期末（改编）",real:1,
   stem:"He is much ______ at English than me.",
   opts:["good","well","better","best"],ans:2,
   ana:"than 提示比较级，good 的比较级是 better；much 修饰比较级。"},

  {id:"e4-1",s:"english",c:"e4",t:"single",lv:1,src:"章节强化",
   stem:"This is ______ movie theater in our city.",
   opts:["good","better","the best","best"],ans:2,
   ana:"in our city 表示范围，用最高级，且最高级前加 the。"},

  {id:"e4-2",s:"english",c:"e4",t:"single",lv:2,src:"章节强化",
   stem:"Shanghai is one of ______ cities in China.",
   opts:["big","bigger","the biggest","biggest"],ans:2,
   ana:"one of the + 最高级 + 名词复数，表示“最…的之一”。"},

  {id:"e4-3",s:"english",c:"e4",t:"fill",lv:2,src:"章节强化",
   stem:"It has ______ (comfortable) seats in town.",ans:["the most comfortable"],
   ana:"多音节形容词最高级用 the most + 原级，comfortable 不能加 -est。"},

  {id:"e4-4",s:"english",c:"e4",t:"judge",lv:2,src:"章节强化",
   stem:"“one of the best student” 是正确的英语表达。",ans:false,
   ana:"one of 后须接复数名词，应改为 one of the best students。"},

  {id:"e4-5",s:"english",c:"e4",t:"single",lv:1,src:"章节强化",
   stem:"— ______ do you like the movie?\n— It's wonderful.",
   opts:["What","How","Which","Why"],ans:1,
   ana:"How do you like …? 意为“你觉得…怎么样”，答语用形容词评价。"},

  {id:"e5-1",s:"english",c:"e5",t:"single",lv:2,src:"唐山·开平 2024 期末（改编）",real:1,
   stem:"If it ______ tomorrow, we will stay at home.",
   opts:["rain","rains","will rain","rained"],ans:1,
   ana:"if 引导条件状语从句遵循“主将从现”，主句用一般将来时，从句用一般现在时；it 为第三人称单数，故 rains。"},

  {id:"e5-2",s:"english",c:"e5",t:"single",lv:2,src:"章节强化",
   stem:"There ______ a football match next week.",
   opts:["will have","is going to have","will be","are going to be"],ans:2,
   ana:"There be 句型的将来时为 There will be 或 There is going to be，不能用 have。"},

  {id:"e5-3",s:"english",c:"e5",t:"fill",lv:2,src:"章节强化",
   stem:"If you ______ (not hurry), you will be late for school.",ans:["don't hurry","do not hurry","dont hurry"],
   ana:"从句用一般现在时，否定形式为 don't hurry。"},

  {id:"e5-4",s:"english",c:"e5",t:"judge",lv:1,src:"章节强化",
   stem:"unless 的意思相当于 if … not。",ans:true,
   ana:"unless = if not，如 Unless you hurry = If you don't hurry，是改写题的常考点。"},

  {id:"e5-5",s:"english",c:"e5",t:"single",lv:1,src:"章节强化",
   stem:"What about ______ shopping this afternoon?",
   opts:["go","going","to go","goes"],ans:1,
   ana:"What about 后接动词 -ing 形式，用于提出建议。"}
];
