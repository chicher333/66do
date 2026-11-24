/* ===========================================================
   题图库：数学几何图 / 物理光路电路图 / 生物结构图 / 地理示意图
   全部为内联 SVG，可随题目一起打印。id 供题目 fig 字段引用。
   =========================================================== */
(function () {
  var K = 'stroke="#3E5C7A" stroke-width="1.5" fill="none" stroke-linejoin="round" stroke-linecap="round"';
  var G = 'stroke="#9FB3C6" stroke-width="1" fill="none"';
  var D = 'stroke="#8FA6BA" stroke-width="1.1" fill="none" stroke-dasharray="4 3"';
  var A = 'stroke="#A96F6A" stroke-width="1.3" fill="none"';
  var T = 'font-size="12" fill="#2F4A63" text-anchor="middle" font-family="inherit"';
  var TS = 'font-size="10.5" fill="#6C8199" text-anchor="middle" font-family="inherit"';
  var FILLF = 'fill="#EAF2F8" stroke="#3E5C7A" stroke-width="1.5"';

  function svg(vb, inner) {
    return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" style="height:auto;display:block;margin:0 auto">' + inner + "</svg>";
  }
  var F = {};

  /* ---------- 数学：三角形外角 ---------- */
  F["f-tri-ext"] = svg("0 0 320 170",
    '<polygon points="70,28 45,140 170,140" ' + K + "/>" +
    '<line x1="170" y1="140" x2="292" y2="140" ' + K + "/>" +
    '<path d="M70 55 A28 28 0 0 1 47 62" ' + A + "/>" +
    '<path d="M100 140 A38 38 0 0 0 88 116" ' + A + "/>" +
    '<text x="70" y="18" ' + T + ">A</text>" +
    '<text x="33" y="152" ' + T + ">B</text>" +
    '<text x="178" y="156" ' + T + ">C</text>" +
    '<text x="300" y="156" ' + T + ">D</text>" +
    '<path d="M170 140 A34 34 0 0 0 148 112" ' + A + "/>");

  /* ---------- 数学：五边形 ---------- */
  F["f-poly"] = svg("0 0 320 205",
    '<polygon points="160,22 288,108 240,190 80,190 32,108" ' + FILLF + "/>" +
    '<line x1="160" y1="22" x2="240" y2="190" ' + D + "/>" +
    '<line x1="160" y1="22" x2="80" y2="190" ' + D + "/>" +
    '<text x="160" y="14" ' + T + ">A</text>" +
    '<text x="300" y="108" ' + T + ">B</text>" +
    '<text x="248" y="202" ' + T + ">C</text>" +
    '<text x="72" y="202" ' + T + ">D</text>" +
    '<text x="20" y="108" ' + T + ">E</text>");

  /* ---------- 数学：全等三角形（SAS） ---------- */
  F["f-cong"] = svg("0 0 330 170",
    '<polygon points="45,28 25,138 132,138" ' + FILLF + "/>" +
    '<polygon points="202,28 182,138 289,138" ' + FILLF + "/>" +
    '<line x1="31" y1="83" x2="39" y2="83" ' + A + "/>" +
    '<line x1="188" y1="83" x2="196" y2="83" ' + A + "/>" +
    '<line x1="82" y1="88" x2="91" y2="80" ' + A + "/>" +
    '<line x1="239" y1="88" x2="248" y2="80" ' + A + "/>" +
    '<path d="M45 46 A22 22 0 0 0 37 55" ' + A + "/>" +
    '<path d="M202 46 A22 22 0 0 0 194 55" ' + A + "/>" +
    '<text x="45" y="18" ' + T + ">A</text>" +
    '<text x="13" y="152" ' + T + ">B</text>" +
    '<text x="142" y="152" ' + T + ">C</text>" +
    '<text x="202" y="18" ' + T + ">D</text>" +
    '<text x="170" y="152" ' + T + ">E</text>" +
    '<text x="299" y="152" ' + T + ">F</text>");

  /* ---------- 数学：同一直线上的全等 ---------- */
  F["f-cong-line"] = svg("0 0 330 160",
    '<line x1="20" y1="118" x2="310" y2="118" ' + K + "/>" +
    '<polygon points="72,32 30,118 182,118" ' + K + "/>" +
    '<polygon points="212,32 110,118 262,118" ' + K + "/>" +
    '<text x="72" y="24" ' + T + ">A</text>" +
    '<text x="20" y="132" ' + T + ">B</text>" +
    '<text x="104" y="132" ' + T + ">E</text>" +
    '<text x="184" y="132" ' + T + ">C</text>" +
    '<text x="268" y="132" ' + T + ">F</text>" +
    '<text x="214" y="24" ' + T + ">D</text>" +
    '<circle cx="30" cy="118" r="2.4" fill="#3E5C7A"/><circle cx="110" cy="118" r="2.4" fill="#3E5C7A"/>' +
    '<circle cx="182" cy="118" r="2.4" fill="#3E5C7A"/><circle cx="262" cy="118" r="2.4" fill="#3E5C7A"/>');

  /* ---------- 数学：角平分线（∠AOB=60°，OP 平分） ---------- */
  F["f-bisector"] = svg("0 0 340 205",
    '<line x1="50" y1="170" x2="315" y2="170" ' + K + "/>" +
    '<line x1="50" y1="170" x2="120" y2="49" ' + K + "/>" +
    '<line x1="50" y1="170" x2="240" y2="60" ' + K + "/>" +
    '<line x1="180" y1="95" x2="180" y2="170" ' + K + "/>" +
    '<line x1="180" y1="95" x2="115" y2="58" ' + K + "/>" +
    '<rect x="173" y="163" width="7" height="7" fill="none" stroke="#A96F6A" stroke-width="1.1"/>' +
    '<rect x="111" y="55" width="7" height="7" fill="none" stroke="#A96F6A" stroke-width="1.1" transform="rotate(30 114 58)"/>' +
    '<path d="M50 138 A32 32 0 0 1 78 154" stroke="#A96F6A" stroke-width="1.1" fill="none"/>' +
    '<circle cx="180" cy="95" r="2.8" fill="#3E5C7A"/><circle cx="115" cy="58" r="2.4" fill="#3E5C7A"/>' +
    '<circle cx="180" cy="170" r="2.4" fill="#3E5C7A"/><circle cx="120" cy="49" r="2.6" fill="#3E5C7A"/>' +
    '<text x="38" y="180" ' + T + ">O</text>" +
    '<text x="322" y="176" ' + T + ">A</text>" +
    '<text x="112" y="42" ' + T + '>B</text>' +
    '<text x="245" y="52" ' + T + ">C</text>" +
    '<text x="192" y="90" ' + T + ">P</text>" +
    '<text x="180" y="188" ' + T + ">D</text>" +
    '<text x="104" y="54" ' + T + ">E</text>");

  /* ---------- 数学：等腰三角形（三线合一） ---------- */
  F["f-iso"] = svg("0 0 300 180",
    '<polygon points="150,24 45,158 255,158" ' + FILLF + "/>" +
    '<line x1="150" y1="24" x2="150" y2="158" ' + D + "/>" +
    '<rect x="150" y="149" width="9" height="9" fill="none" stroke="#A96F6A" stroke-width="1.1" transform="rotate(-90 150 158)"/>' +
    '<line x1="94" y1="88" x2="104" y2="96" ' + A + "/>" +
    '<line x1="196" y1="96" x2="206" y2="88" ' + A + "/>" +
    '<text x="150" y="16" ' + T + ">A</text>" +
    '<text x="33" y="172" ' + T + ">B</text>" +
    '<text x="267" y="172" ' + T + ">C</text>" +
    '<text x="150" y="174" ' + T + ">D</text>");

  /* ---------- 数学：垂直平分线交腰 ---------- */
  F["f-iso2"] = svg("0 0 300 190",
    '<polygon points="150,22 60,165 240,165" ' + K + "/>" +
    '<line x1="45" y1="52" x2="188" y2="136" ' + D + "/>" +
    '<line x1="60" y1="165" x2="169" y2="131" ' + K + "/>" +
    '<circle cx="169" cy="131" r="2.6" fill="#3E5C7A"/>' +
    '<circle cx="105" cy="93" r="2.4" fill="#3E5C7A"/>' +
    '<text x="150" y="14" ' + T + ">A</text>" +
    '<text x="48" y="180" ' + T + ">B</text>" +
    '<text x="252" y="180" ' + T + ">C</text>" +
    '<text x="180" y="128" ' + T + ">D</text>" +
    '<text x="96" y="88" ' + T + ">E</text>");

  /* ---------- 数学：方格纸轴对称作图 ---------- */
  F["f-grid-sym"] = svg("0 0 340 210",
    (function () {
      var s = "", i;
      for (i = 0; i <= 6; i++) s += '<line x1="' + (45 + i * 36) + '" y1="10" x2="' + (45 + i * 36) + '" y2="190" ' + G + "/>";
      for (i = 0; i <= 5; i++) s += '<line x1="45" y1="' + (190 - i * 36) + '" x2="261" y2="' + (190 - i * 36) + '" ' + G + "/>";
      return s;
    })() +
    '<polygon points="117,154 225,154 189,46" ' + FILLF + "/>" +
    '<line x1="296" y1="16" x2="296" y2="196" stroke="#A96F6A" stroke-width="1.6" stroke-dasharray="7 4"/>' +
    '<text x="308" y="20" ' + T + ' fill="#A96F6A">l</text>' +
    '<text x="108" y="168" ' + T + ">A</text>" +
    '<text x="234" y="168" ' + T + ">B</text>" +
    '<text x="186" y="38" ' + T + ">C</text>");

  /* ---------- 数学：方格中的三角形面积 ---------- */
  F["f-grid-area"] = svg("0 0 330 200",
    (function () {
      var s = "", i;
      for (i = 0; i <= 8; i++) s += '<line x1="' + (40 + i * 34) + '" y1="14" x2="' + (40 + i * 34) + '" y2="186" ' + G + "/>";
      for (i = 0; i <= 5; i++) s += '<line x1="40" y1="' + (186 - i * 34) + '" x2="312" y2="' + (186 - i * 34) + '" ' + G + "/>";
      return s;
    })() +
    '<line x1="24" y1="152" x2="320" y2="152" stroke="#3E5C7A" stroke-width="1.4"/>' +
    '<line x1="108" y1="192" x2="108" y2="8" stroke="#3E5C7A" stroke-width="1.4"/>' +
    '<text x="318" y="146" ' + TS + ">x</text>" +
    '<text x="116" y="14" ' + TS + ">y</text>" +
    '<text x="96" y="146" ' + TS + ">O</text>" +
    '<polygon points="40,118 176,118 142,50" fill="rgba(169,111,106,.12)" stroke="#A96F6A" stroke-width="1.6"/>' +
    '<circle cx="40" cy="118" r="2.6" fill="#A96F6A"/><circle cx="176" cy="118" r="2.6" fill="#A96F6A"/>' +
    '<circle cx="142" cy="50" r="2.6" fill="#A96F6A"/>' +
    '<text x="32" y="112" ' + T + ">A</text>" +
    '<text x="184" y="112" ' + T + ">B</text>" +
    '<text x="144" y="42" ' + T + ">C</text>");

  /* ---------- 数学：最短路径 ---------- */
  F["f-shortest"] = svg("0 0 330 165",
    '<line x1="24" y1="125" x2="306" y2="125" ' + K + "/>" +
    '<text x="314" y="130" ' + T + ">l</text>" +
    '<circle cx="92" cy="46" r="2.8" fill="#3E5C7A"/><circle cx="238" cy="46" r="2.8" fill="#3E5C7A"/>' +
    '<line x1="92" y1="46" x2="168" y2="125" stroke="#A96F6A" stroke-width="1.4" stroke-dasharray="5 3"/>' +
    '<line x1="238" y1="46" x2="168" y2="125" stroke="#A96F6A" stroke-width="1.4" stroke-dasharray="5 3"/>' +
    '<circle cx="168" cy="125" r="2.8" fill="#A96F6A"/>' +
    '<text x="92" y="36" ' + T + ">A</text>" +
    '<text x="238" y="36" ' + T + ">B</text>" +
    '<text x="168" y="143" ' + T + ' fill="#A96F6A">P</text>');

  /* ---------- 数学：30° 直角三角形 ---------- */
  F["f-rt30"] = svg("0 0 300 205",
    '<polygon points="60,16 60,180 158,180" ' + FILLF + "/>" +
    '<rect x="60" y="171" width="9" height="9" fill="none" stroke="#A96F6A" stroke-width="1.1"/>' +
    '<path d="M60 52 A36 36 0 0 1 78 62" ' + A + "/>" +
    '<text x="60" y="10" ' + T + ">A</text>" +
    '<text x="60" y="196" ' + T + ">C</text>" +
    '<text x="168" y="196" ' + T + ">B</text>" +
    '<text x="88" y="60" ' + TS + ">30°</text>");

  /* ---------- 物理：光的反射（入射角 40°） ---------- */
  F["f-reflect"] = svg("0 0 330 190",
    '<line x1="36" y1="140" x2="300" y2="140" ' + K + "/>" +
    '<line x1="170" y1="40" x2="170" y2="176" ' + D + "/>" +
    '<line x1="86" y1="40" x2="170" y2="140" stroke="#A96F6A" stroke-width="1.6"/>' +
    '<line x1="170" y1="140" x2="254" y2="40" stroke="#A96F6A" stroke-width="1.6"/>' +
    '<path d="M170 116 A24 24 0 0 1 155 122" stroke="#2F4A63" stroke-width="1.2" fill="none"/>' +
    '<path d="M170 116 A24 24 0 0 0 185 122" stroke="#2F4A63" stroke-width="1.2" fill="none"/>' +
    '<circle cx="170" cy="140" r="2.8" fill="#3E5C7A"/>' +
    '<text x="170" y="30" ' + TS + ">法线 ON</text>" +
    '<text x="64" y="34" ' + TS + ">入射光线</text>" +
    '<text x="268" y="34" ' + TS + ">反射光线</text>" +
    '<text x="178" y="166" ' + T + ">O</text>" +
    '<text x="262" y="154" ' + TS + ">平面镜</text>");

  /* ---------- 物理：凸透镜成像（u>2f） ---------- */
  F["f-lens"] = svg("0 0 350 200",
    '<line x1="12" y1="100" x2="338" y2="100" ' + G + "/>" +
    '<ellipse cx="175" cy="100" rx="9" ry="62" ' + K + "/>" +
    '<line x1="36" y1="100" x2="36" y2="46" stroke="#A96F6A" stroke-width="1.8"/>' +
    '<polygon points="36,40 31,50 41,50" fill="#A96F6A"/>' +
    '<line x1="36" y1="46" x2="175" y2="46" stroke="#5F7F68" stroke-width="1.4"/>' +
    '<line x1="175" y1="46" x2="280" y2="142" stroke="#5F7F68" stroke-width="1.4"/>' +
    '<line x1="36" y1="46" x2="280" y2="142" stroke="#5F7F68" stroke-width="1.2" stroke-dasharray="5 3"/>' +
    '<line x1="280" y1="100" x2="280" y2="146" stroke="#5F7F68" stroke-width="1.4" stroke-dasharray="4 3"/>' +
    '<polygon points="280,152 275,142 285,142" fill="#5F7F68"/>' +
    '<circle cx="115" cy="100" r="2.4" fill="#3E5C7A"/><circle cx="235" cy="100" r="2.4" fill="#3E5C7A"/>' +
    '<circle cx="55" cy="100" r="2.4" fill="#3E5C7A"/><circle cx="295" cy="100" r="2.4" fill="#3E5C7A"/>' +
    '<text x="115" y="114" ' + TS + ">F</text>" +
    '<text x="235" y="114" ' + TS + ">F</text>" +
    '<text x="52" y="114" ' + TS + ">2F</text>" +
    '<text x="295" y="114" ' + TS + ">2F</text>" +
    '<text x="175" y="182" ' + TS + ">凸透镜" + "</text>" +
    '<text x="36" y="64" ' + TS + ">物" + "</text>" +
    '<text x="292" y="142" ' + TS + ">像" + "</text>");

  /* ---------- 物理：平面镜成像实验 ---------- */
  F["f-mirror"] = svg("0 0 330 200",
    '<line x1="30" y1="172" x2="300" y2="172" ' + K + "/>" +
    '<line x1="170" y1="34" x2="170" y2="172" stroke="#7FA6C4" stroke-width="2.4"/>' +
    '<line x1="106" y1="172" x2="106" y2="120" stroke="#A96F6A" stroke-width="2"/>' +
    '<circle cx="106" cy="116" r="4" fill="#A96F6A"/>' +
    '<line x1="234" y1="172" x2="234" y2="120" stroke="#8FA6BA" stroke-width="1.6" stroke-dasharray="4 3"/>' +
    '<circle cx="234" cy="116" r="4" fill="none" stroke="#8FA6BA" stroke-width="1.4" stroke-dasharray="3 2"/>' +
    '<line x1="106" y1="116" x2="234" y2="116" ' + D + "/>" +
    '<line x1="106" y1="172" x2="234" y2="172" ' + D + "/>" +
    '<text x="96" y="110" ' + TS + ">A</text>" +
    '<text x="246" y="110" ' + TS + ">A′</text>" +
    '<text x="170" y="26" ' + TS + ">玻璃板</text>" +
    '<text x="270" y="188" ' + TS + ">白纸（刻度尺）</text>");

  /* ---------- 物理：路程—时间图像（坐标系带刻度） ---------- */
  F["f-speed"] = svg("0 0 330 200",
    '<line x1="52" y1="160" x2="300" y2="160" stroke="#3E5C7A" stroke-width="1.4"/>' +
    '<line x1="52" y1="160" x2="52" y2="22" stroke="#3E5C7A" stroke-width="1.4"/>' +
    '<polygon points="300,160 292,157 292,163" fill="#3E5C7A"/>' +
    '<polygon points="52,20 49,28 55,28" fill="#3E5C7A"/>' +
    (function () {
      var s = "", i, x, y;
      for (i = 1; i <= 6; i++) {
        x = 52 + i * 40;
        s += '<line x1="' + x + '" y1="160" x2="' + x + '" y2="165" stroke="#3E5C7A" stroke-width="1"/>';
        s += '<text x="' + x + '" y="178" ' + TS + ">" + i + "</text>";
      }
      for (i = 1; i <= 6; i++) {
        y = 160 - i * 20;
        s += '<line x1="47" y1="' + y + '" x2="52" y2="' + y + '" stroke="#3E5C7A" stroke-width="1"/>';
        s += '<text x="42" y="' + (y + 4) + '" ' + TS + ' text-anchor="end">' + i * 4 + "</text>";
      }
      return s;
    })() +
    '<polyline points="52,160 292,40" stroke="#A96F6A" stroke-width="1.8" fill="none"/>' +
    '<polyline points="52,160 292,100" stroke="#5F7F68" stroke-width="1.8" fill="none"/>' +
    '<circle cx="172" cy="100" r="2.6" fill="#A96F6A"/><circle cx="172" cy="130" r="2.6" fill="#5F7F68"/>' +
    '<text x="310" y="172" ' + TS + ">t/s</text>" +
    '<text x="40" y="18" ' + TS + ">s/m</text>" +
    '<text x="272" y="34" ' + TS + ' fill="#A96F6A">甲</text>' +
    '<text x="272" y="94" ' + TS + ' fill="#5F7F68">乙</text>' +
    '<text x="44" y="176" ' + TS + ">O</text>");

  /* ---------- 物理：温度计（示数 96 ℃） ---------- */
  F["f-thermo"] = svg("0 0 250 210",
    '<rect x="104" y="18" width="22" height="150" rx="10" ' + K + "/>" +
    '<circle cx="115" cy="176" r="16" ' + K + "/>" +
    '<rect x="108" y="52" width="14" height="126" rx="7" fill="#C97C74"/>' +
    '<circle cx="115" cy="176" r="11" fill="#C97C74"/>' +
    (function () {
      var s = "", i, y;
      for (i = 0; i <= 10; i++) {
        y = 26 + i * 13;
        s += '<line x1="' + (i % 5 === 0 ? 126 : 130) + '" y1="' + y + '" x2="150" y2="' + y + '" ' + G + "/>";
        if (i % 2 === 0) s += '<text x="158" y="' + (y + 4) + '" ' + TS + ' text-anchor="start">' + (100 - i * 2) + "</text>";
      }
      return s;
    })() +
    '<text x="196" y="140" ' + TS + ' text-anchor="start">℃</text>');

  /* ---------- 物理：量筒（液面 50 mL） ---------- */
  F["f-cylinder"] = svg("0 0 240 220",
    '<path d="M88 22 L88 186 Q88 202 120 202 Q152 202 152 186 L152 22" ' + K + "/>" +
    '<line x1="88" y1="22" x2="152" y2="22" ' + K + "/>" +
    '<path d="M92 76 L92 184 Q92 196 120 196 Q148 196 148 184 L148 76 Z" fill="#DCEAF4" stroke="none"/>' +
    '<line x1="88" y1="76" x2="152" y2="76" stroke="#7FA6C4" stroke-width="1.6"/>' +
    (function () {
      var s = "", i;
      for (i = 0; i <= 8; i++) {
        var y = 40 + i * 18;
        s += '<line x1="' + (i % 2 === 0 ? 94 : 100) + '" y1="' + y + '" x2="112" y2="' + y + '" ' + G + "/>";
      }
      return s;
    })() +
    '<text x="120" y="44" ' + TS + ">60</text>" +
    '<text x="120" y="80" ' + TS + ">50</text>" +
    '<text x="120" y="116" ' + TS + ">40 mL</text>");

  /* ---------- 生物：细菌结构 ---------- */
  F["f-bacteria"] = svg("0 0 330 190",
    '<rect x="70" y="40" width="180" height="88" rx="44" ' + FILLF + "/>" +
    '<rect x="82" y="52" width="156" height="64" rx="32" fill="none" stroke="#9FB3C6" stroke-width="1.2"/>' +
    '<path d="M196 84 q26 12 6 34 q-16 18 6 30" stroke="#A96F6A" stroke-width="1.6" fill="none"/>' +
    '<path d="M120 72 q30 8 46 22 q-24 12 -46 6 q-10 -14 0 -28" fill="none" stroke="#5F7F68" stroke-width="1.5"/>' +
    '<line x1="70" y1="40" x2="70" y2="128" stroke="#3E5C7A" stroke-width="1.4" stroke-dasharray="0" opacity="0"/>' +
    '<line x1="100" y1="30" x2="100" y2="18" ' + D + "/><text x=\"100\" y=\"14\" " + TS + ">荚膜</text>" +
    '<line x1="86" y1="140" x2="66" y2="164" ' + D + "/><text x=\"52\" y=\"176\" " + TS + ">细胞壁</text>" +
    '<line x1="120" y1="140" x2="120" y2="164" ' + D + "/><text x=\"122\" y=\"176\" " + TS + ">细胞膜</text>" +
    '<line x1="176" y1="140" x2="190" y2="164" ' + D + "/><text x=\"202\" y=\"176\" " + TS + ">细胞质</text>" +
    '<line x1="146" y1="86" x2="196" y2="60" ' + D + "/><text x=\"214\" y=\"56\" " + TS + ">DNA 集中区</text>" +
    '<text x="252" y="164" ' + TS + ">鞭毛</text>");

  /* ---------- 地理：地势三级阶梯 ---------- */
  F["f-terrain"] = svg("0 0 350 200",
    '<path d="M20 168 L20 60 L96 60 L96 108 L176 108 L176 138 L258 138 L258 158 L330 158 L330 168 Z" fill="#E8F0F6" stroke="#3E5C7A" stroke-width="1.4"/>' +
    '<line x1="20" y1="168" x2="330" y2="168" stroke="#3E5C7A" stroke-width="1.6"/>' +
    '<text x="58" y="50" ' + TS + ">青藏高原</text>" +
    '<text x="58" y="82" ' + TS + ">第一级</text>" +
    '<text x="136" y="98" ' + TS + ">四川盆地</text>" +
    '<text x="136" y="124" ' + TS + ">第二级</text>" +
    '<text x="240" y="132" ' + TS + ">长江中下游平原</text>" +
    '<text x="240" y="152" ' + TS + ">第三级</text>" +
    '<text x="34" y="182" ' + TS + ">西" + "</text>" +
    '<text x="318" y="182" ' + TS + ">东" + "</text>" +
    '<line x1="30" y1="188" x2="322" y2="188" stroke="#9FB3C6" stroke-width="1"/>' +
    '<polygon points="322,188 314,185 314,191" fill="#9FB3C6"/>');

  /* ---------- 生物：蚯蚓外形 ---------- */
  F["f-annelid"] = svg("0 0 330 150",
    '<path d="M36 78 Q80 56 130 72 Q180 88 230 70 Q270 56 296 74 Q270 96 230 90 Q180 106 130 90 Q80 76 36 96 Z" ' + FILLF + "/>" +
    (function () {
      var s = "", i, x;
      for (i = 1; i <= 15; i++) {
        x = 40 + i * 17;
        s += '<line x1="' + x + '" y1="' + (66 + Math.sin(i) * 5) + '" x2="' + (x - 3) + '" y2="' + (94 + Math.sin(i) * 4) + '" stroke="#9FB3C6" stroke-width="1"/>';
      }
      return s;
    })() +
    '<rect x="150" y="66" width="26" height="30" rx="8" fill="#C9B79A" opacity=".65"/>' +
    '<text x="34" y="60" ' + TS + ">前端</text>" +
    '<text x="163" y="60" ' + TS + ">环带</text>" +
    '<text x="240" y="52" ' + TS + ">体节</text>" +
    '<text x="300" y="112" ' + TS + ">刚毛</text>" +
    '<line x1="296" y1="106" x2="270" y2="86" ' + D + "/>");

  /* ---------- 生物：关节结构 ---------- */
  F["f-joint"] = svg("0 0 330 205",
    '<rect x="24" y="64" width="96" height="34" rx="10" ' + FILLF + "/>" +
    '<circle cx="140" cy="81" r="26" ' + FILLF + "/>" +
    '<path d="M206 46 A38 38 0 0 0 206 116 L300 116 L300 46 Z" ' + FILLF + "/>" +
    '<path d="M206 46 A38 38 0 0 0 206 116" stroke="#A96F6A" stroke-width="3.2" fill="none"/>' +
    '<circle cx="140" cy="81" r="26" stroke="#A96F6A" stroke-width="3.2" fill="none"/>' +
    '<path d="M104 34 Q150 14 196 30" ' + D + "/>" +
    '<line x1="120" y1="30" x2="132" y2="56" ' + D + "/>" +
    '<line x1="262" y1="34" x2="242" y2="62" ' + D + "/>" +
    '<line x1="176" y1="140" x2="182" y2="96" ' + D + "/>" +
    '<line x1="130" y1="150" x2="140" y2="112" ' + D + "/>" +
    '<text x="112" y="26" ' + TS + ">关节头</text>" +
    '<text x="270" y="30" ' + TS + ">关节窝</text>" +
    '<text x="176" y="154" ' + TS + ">关节腔</text>" +
    '<text x="112" y="164" ' + TS + ">关节软骨</text>" +
    '<text x="150" y="14" ' + TS + ">关节囊</text>" +
    '<text x="58" y="56" ' + TS + ">骨</text>");

  window.FIGS = F;
})();
