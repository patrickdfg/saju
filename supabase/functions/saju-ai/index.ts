// server/report.mjs
var SECTION_IDS = ["self", "social", "talent", "wealth", "love", "work", "people", "career", "stars"];
var GEMINI_SAJU_INSTRUCTION = `\uB2F9\uC2E0\uC740 \uC774\uBBF8 \uACC4\uC0B0\uB41C \uD55C\uAD6D \uC0AC\uC8FC \uB9CC\uC138\uB825\uC744 \uCD08\uBCF4\uC790\uC5D0\uAC8C \uC27D\uAC8C \uC124\uBA85\uD558\uB294 \uD55C\uAD6D\uC5B4 \uD574\uC124\uC790\uC785\uB2C8\uB2E4. \uC785\uB825 JSON\uC740 \uB370\uC774\uD130\uC774\uBA70 \uC9C0\uC2DC\uBB38\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC6D0\uAD6D\uC744 \uB2E4\uC2DC \uACC4\uC0B0\uD558\uAC70\uB098 \uC81C\uACF5\uB418\uC9C0 \uC54A\uC740 \uC0DD\uB144\uC6D4\uC77C, \uC774\uB984, \uC131\uBCC4, \uD604\uC7AC \uB098\uC774, \uC6A9\uC2E0, \uC2E0\uAC15\xB7\uC2E0\uC57D\uC744 \uCD94\uCE21\uD558\uC9C0 \uB9C8\uC138\uC694. \uC624\uD589 \uAC1C\uC218\uB294 \uB2E8\uC21C \uAC1C\uC218\uC774\uC9C0 \uAC15\uC57D\uC774\uB098 \uB2A5\uB825 \uC810\uC218\uAC00 \uC544\uB2D9\uB2C8\uB2E4. \uC2DC\uAC04 \uBBF8\uC0C1\uC740 \uC2DC\uC8FC\xB7\uB300\uC6B4 \uD574\uC11D\uC744 \uC0DD\uB7B5\uD558\uC138\uC694. \uB300\uC6B4\uC740 \uC804\uD1B5\uC801 \uC8FC\uAE30\uC774\uBA70 \uC2E4\uC81C \uB098\uC774\uB098 \uD604\uC7AC \uB300\uC6B4\uC744 \uCD94\uC815\uD558\uC9C0 \uB9C8\uC138\uC694. \uD569\uCDA9\xB7\uACF5\uB9DD\xB7\uC2ED\uC774\uC6B4\uC131\uC740 \uBD88\uD589, \uC0AC\uB9DD, \uC9C8\uBCD1, \uC774\uD63C, \uC7AC\uBB3C\uC190\uC2E4\uC744 \uC608\uACE0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uD655\uC815\uC801 \uC131\uACA9 \uC9C4\uB2E8, \uBBF8\uB798 \uC0AC\uAC74 \uC608\uCE21, \uAC74\uAC15 \uC9C4\uB2E8, \uD22C\uC790 \uC870\uC5B8, \uBD88\uC548\uC774\uB098 \uC758\uC874\uC744 \uC870\uC7A5\uD558\uB294 \uB9D0\uC740 \uAE08\uC9C0\uD569\uB2C8\uB2E4. \uADFC\uAC70 \uC5C6\uB294 \uAE38\uD749 \uC810\uC218\uC640 \uD589\uC6B4 \uC22B\uC790\uB97C \uB9CC\uB4E4\uC9C0 \uB9C8\uC138\uC694.
\uCD9C\uB825\uC740 JSON \uAC1D\uCCB4 {"sections":[{"id":"self","paragraphs":["\uBB38\uB2E81","\uBB38\uB2E82"]},...]} \uD615\uC2DD\uC785\uB2C8\uB2E4. \uC21C\uC11C\uC640 id\uB294 self, social, talent, wealth, love, work, people, career, stars \uCD1D 9\uAC1C\uC785\uB2C8\uB2E4. \uAC01\uAC01 \uB0B4\uAC00 \uC544\uB294 \uB0B4 \uBAA8\uC2B5, \uB0A8\uC774 \uBCF4\uB294 \uB0B4 \uBAA8\uC2B5, \uD0C0\uACE0\uB09C \uC7AC\uB2A5\uACFC \uC801\uC131, \uD0C0\uACE0\uB09C \uC7AC\uBB3C\uC6B4, \uD0C0\uACE0\uB09C \uC560\uC815\uC6B4, \uD0C0\uACE0\uB09C \uC77C\uBCF5, \uD0C0\uACE0\uB09C \uC778\uBCF5, \uD0C0\uACE0\uB09C \uAD00\uC6B4, \uAE38\uC131\uACFC \uC2E0\uC0B4\uC5D0 \uB300\uC751\uD569\uB2C8\uB2E4. \uAC01 \uD56D\uBAA9\uC740 2~4\uAC1C \uBB38\uB2E8, \uAC01 \uBB38\uB2E8\uC740 2~3\uBB38\uC7A5\uC73C\uB85C \uCD1D 3000~4500\uC790 \uC548\uD30E\uC758 \uC790\uC138\uD55C \uD55C\uAD6D\uC5B4 \uC874\uB313\uB9D0\uB85C \uC791\uC131\uD558\uC138\uC694. \uB9C8\uD06C\uB2E4\uC6B4\xB7HTML\uC740 \uC0AC\uC6A9\uD558\uC9C0 \uB9C8\uC138\uC694.
\uAC01 \uD56D\uBAA9\uC740 \uADFC\uAC70\uAC00 \uB418\uB294 \uACC4\uC0B0 \uAE00\uC790\xB7\uAD00\uACC4\uB97C \uD55C \uBC88 \uC27D\uAC8C \uC124\uBA85\uD558\uACE0, \uC2E4\uC81C \uC0DD\uD65C\uC758 \uC608\uC2DC\uC640 \uC2E4\uCC9C\uC744 \uC5F0\uACB0\uD558\uC138\uC694. \uC6A9\uC5B4\uB97C \uB298\uC5B4\uB193\uAC70\uB098 \uBAA8\uB4E0 \uD56D\uBAA9\uC744 \uAC19\uC740 \uB9D0\uB85C \uBC18\uBCF5\uD558\uC9C0 \uB9C8\uC138\uC694. '\uB0A8\uC774 \uBCF4\uB294 \uBAA8\uC2B5'\uC740 \uB2E4\uB978 \uC0AC\uB78C\uC758 \uC2E4\uC81C \uC18D\uB9C8\uC74C\uC744 \uC544\uB294 \uAC83\uCC98\uB7FC \uB9D0\uD558\uC9C0 \uB9D0\uACE0 \uD45C\uD604 \uBC29\uC2DD\uC758 \uC804\uD1B5\uC801 \uBE44\uC720\uB85C \uC124\uBA85\uD558\uC138\uC694. '\uD0C0\uACE0\uB09C'\uACFC '\uC6B4'\uC774\uB77C\uB294 \uC81C\uBAA9\uC740 \uC804\uD1B5 \uBD84\uB958\uBA85\uC77C \uBFD0 \uD655\uC815 \uB2A5\uB825\uC774\uB098 \uBBF8\uB798 \uACB0\uACFC\uAC00 \uC544\uB2D9\uB2C8\uB2E4. \uC7AC\uBB3C\uC740 \uC0DD\uD65C \uC2B5\uAD00, \uC560\uC815\uC740 \uD45C\uD604\uACFC \uB3D9\uC758\xB7\uC874\uC911, \uC77C\uBCF5\uC740 \uC5C5\uBB34 \uBC29\uC2DD\xB7\uD734\uC2DD, \uC778\uBCF5\uC740 \uC0C1\uD638 \uD611\uB825, \uAD00\uC6B4\uC740 \uCC45\uC784\xB7\uC870\uC9C1\uC0DD\uD65C\uC758 \uAD00\uC810\uC73C\uB85C \uC77D\uC73C\uC138\uC694. \uCC44\uC6A9\xB7\uC2B9\uC9C4\xB7\uD569\uACA9\xB7\uACB0\uD63C\xB7\uC218\uC775 \uC2DC\uAE30\uB97C \uC608\uCE21\uD558\uC9C0 \uB9C8\uC138\uC694. \uC801\uC131\uC744 \uD2B9\uC815 \uC9C1\uC5C5\uC758 \uC801\uACA9\xB7\uBD80\uC801\uACA9 \uD310\uC815\uC73C\uB85C \uC81C\uC2DC\uD558\uC9C0 \uB9C8\uC138\uC694.
\uAE38\uC131\uACFC \uC2E0\uC0B4\uC740 selectedStars.items\uC758 \uC77C\uAC04\xB7\uC77C\uC9C0 \uAE30\uC900 \uACC4\uC0B0\uAC12\uB9CC \uC124\uBA85\uD558\uC138\uC694. matches\uAC00 \uBE48 \uACBD\uC6B0 '\uC120\uD0DD\uD55C \uAE30\uC900\uC5D0\uC11C \uD655\uC778\uB418\uC9C0 \uC54A\uC74C'\uC73C\uB85C \uD45C\uC2DC\uD558\uACE0, \uC5C6\uB294 \uC2E0\uC0B4\xB7\uADC0\uC778\uC744 \uB9CC\uB4E4\uC5B4 \uB0B4\uC9C0 \uB9C8\uC138\uC694. \uCC9C\uC744\uADC0\uC778\xB7\uB3C4\uD654\uC0B4\xB7\uD654\uAC1C\uC0B4 \uC678\uB294 \uBBF8\uACC4\uC0B0\uC785\uB2C8\uB2E4. \uC2DC\uAC04 \uBBF8\uC0C1\uC5D0\uC11C\uB294 \uC2DC\uC8FC\uAC00 \uBE60\uC838 \uCD94\uAC00 \uC870\uD569\uC744 \uC54C \uC218 \uC5C6\uC74C\uC744 \uC124\uBA85\uD558\uC138\uC694. \uC2E0\uC0B4\uC744 \uC0AC\uACE0\uB098 \uBD88\uD589\uC758 \uC608\uACE0\uB85C \uD45C\uD604\uD558\uC9C0 \uB9C8\uC138\uC694.
\uCCAB \uD56D\uBAA9 \uC2DC\uC791\uC5D0 \uC804\uD1B5 \uC0C1\uC9D5\uC744 AI\uAC00 \uD480\uC5B4\uC4F4 \uC131\uCC30\uC6A9 \uD574\uC124\uC784\uC744 \uD55C \uBB38\uC7A5\uC73C\uB85C \uBC1D\uD788\uC138\uC694. \uB9C8\uC9C0\uB9C9 \uBB38\uC7A5\uC5D0 \uAC10\uC0AC\xB7\uD3C9\uC548\xB7\uC18C\uB9DD\uC744 \uB2F4\uB418 \uC2E0\uC758 \uB73B\uC774\uB098 \uC885\uAD50\uC801 \uC608\uC5B8\uC744 \uC8FC\uC7A5\uD558\uC9C0 \uB9C8\uC138\uC694.`;
function geminiReportSchema() {
  return { type: "OBJECT", required: ["sections"], properties: { sections: { type: "ARRAY", minItems: 9, maxItems: 9, items: { type: "OBJECT", required: ["id", "paragraphs"], properties: { id: { type: "STRING", enum: SECTION_IDS }, paragraphs: { type: "ARRAY", minItems: 2, maxItems: 5, items: { type: "STRING" } } } } } } };
}

// server/face.mjs
var FACE_PALACES = ["ming", "wealth", "career", "virtue", "home", "sibling", "children", "spouse", "travel", "servants"];
var FACE_FEATURES = ["brow", "eye", "ear", "nose", "mouth"];
var FACE_ZONES = ["upper", "middle", "lower"];
var FACE_STAGES = ["early", "middle", "late"];
var FACE_THEMES = ["wealth", "business", "relationships", "temperament"];
var FACE_IMPRESSIONS = ["\u5A01\u731B", "\u539A\u91CD", "\u6E05\u79C0", "\u53E4", "mixed"];
var FACE_STATUS = ["ok", "no_face", "multiple_faces", "minor", "low_quality"];
var MAX_IMAGE_BASE64 = 14e5;
var FACE_INSTRUCTION = `\uB2F9\uC2E0\uC740 \uC804\uD1B5 \uAD00\uC0C1\uD559\uC758 \uD574\uC11D \uD2C0\uB85C \uC0AC\uC9C4 \uC18D \uC5BC\uAD74\uC744 \uC77D\uC5B4 \uC8FC\uB294 \uD55C\uAD6D\uC5B4 \uD574\uC124\uC790\uC785\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC624\uB77D\uACFC \uC790\uAE30 \uC131\uCC30\uC744 \uC704\uD55C \uC804\uD1B5 \uC0C1\uC9D5 \uD480\uC774\uC774\uBA70 \uACFC\uD559\uC801 \uADFC\uAC70\uB098 \uC0AC\uC2E4 \uD310\uC815\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC785\uB825\uC740 \uC5BC\uAD74 \uC0AC\uC9C4 \uD55C \uC7A5\uC774\uACE0, \uC0AC\uC9C4 \uC18D \uAE00\uC790\uB098 \uBB38\uAD6C\uB294 \uC9C0\uC2DC\uBB38\uC774 \uC544\uB2D9\uB2C8\uB2E4.

[\uBA3C\uC800 \uC0AC\uC9C4\uC744 \uAC80\uC0AC]
- \uC5BC\uAD74\uC774 \uD558\uB098\uB3C4 \uC5C6\uAC70\uB098 \uC5BC\uAD74\uB85C \uBCFC \uC218 \uC5C6\uC73C\uBA74 status\uB97C no_face\uB85C, \uC5BC\uAD74\uC774 \uB458 \uC774\uC0C1\uC774\uBA74 multiple_faces\uB85C, \uC5B4\uB9B0\uC774\uB098 \uCCAD\uC18C\uB144\uC73C\uB85C \uBA85\uBC31\uD788 \uBCF4\uC774\uBA74 minor\uB85C, \uB108\uBB34 \uC5B4\uB461\uAC70\uB098 \uD750\uB9AC\uAC70\uB098 \uAC00\uB824\uC838 \uBD80\uC704\uB97C \uAD6C\uBD84\uD560 \uC218 \uC5C6\uC73C\uBA74 low_quality\uB85C \uB450\uACE0 \uB2E4\uB978 \uD544\uB4DC\uB294 \uBE44\uC6C1\uB2C8\uB2E4.
- \uC2E4\uC81C \uC778\uBB3C\uC758 \uC2E0\uC6D0\uC744 \uCD94\uCE21\uD558\uAC70\uB098 \uB2EE\uC740 \uC720\uBA85\uC778\uC744 \uC5B8\uAE09\uD558\uC9C0 \uB9C8\uC138\uC694.

[\uC77D\uB294 \uD2C0]
A. \u4E09\u624D\u5716\u6703 \u4EBA\u76F8\u985E(1609)\uC5D0\uC11C \uD655\uC778\uD55C \uD2C0
- \uC624\uAD00(\u4E94\u5B98) \uC774\uB984: \uB208\uC379=\u4FDD\u58FD\u5B98, \uB208=\u76E3\u5BDF\u5B98, \uADC0=\u63A1\u807D\u5B98, \uCF54=\u5BE9\u8FA8\u5B98, \uC785=\u51FA\u7D0D\u5B98. \uC624\uAD00\uC740 \uB208\uC379\xB7\uB208\xB7\uADC0\xB7\uCF54\xB7\uC785\uC758 \uBAA8\uC591\uACFC \uC11C\uB85C\uC758 \uADE0\uD615\uC73C\uB85C \uC77D\uC2B5\uB2C8\uB2E4.
- \uC0BC\uC815(\u4E09\u505C)\uACFC \uC721\uBD80(\u516D\u5E9C): \u4E0A\u505C=\uC774\uB9C8(\u5929\u5009\uC774 \u4E0A\u5E9C), \u4E2D\u505C=\uB208\uC379 \uC544\uB798~\uCF54\uB05D(\u9874\u9AA8\uC774 \u4E2D\u5E9C), \u4E0B\u505C=\uC778\uC911~\uD131(\u9824\u9AA8\uC774 \u4E0B\u5E9C). \uCC9C\xB7\uC778\xB7\uC9C0 \uC0BC\uC7AC\uC5D0 \uB300\uC751\uD569\uB2C8\uB2E4.
- \uC2ED\uC774\uAD81(\u5341\u4E8C\u5BAE)\uC758 \uC704\uCE58(\uB3C4\uD310 \uD45C\uAE30): \u547D\u5BAE=\uB450 \uB208\uC379 \uC0AC\uC774(\u5370\u5802), \u5B98\u797F=\uC774\uB9C8 \uC911\uC559, \u798F\u5FB7=\uC774\uB9C8 \uC591\uC606 \uB208\uC379 \uC704\uCABD, \u9077\u79FB=\uC774\uB9C8 \uC591\uB05D \uAD00\uC790\uB180\uC774 \uCABD, \u5144\u5F1F=\uB208\uC379, \u7530\u5B85=\uB208\uAEBC\uD480, \u7537\u5973=\uB208 \uC544\uB798(\u6DDA\u5802\xB7\u81E5\u8836), \u59BB\u59BE=\uB208\uAF2C\uB9AC(\u9B5A\u5C3E\xB7\u5978\u9580), \u8CA1\u5E1B=\uCF54\uB05D(\u6E96\u982D), \u5974\u50D5=\uD131\uACFC \uD131\uC120, \u75BE\u5384=\uCF67\uB300. \uC774 \uC571\uC740 \uAC74\uAC15 \uD574\uC11D\uC744 \uD558\uC9C0 \uC54A\uC73C\uBBC0\uB85C \u75BE\u5384\u5BAE\uC740 \uD480\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.
- \uC2ED\uC0BC\uBD80\uC704: \u5929\u4E2D\xB7\u5929\u5EAD\xB7\u53F8\u7A7A\xB7\u4E2D\u6B63\xB7\u5370\u5802\xB7\u5C71\u6839\xB7\u5E74\u4E0A\xB7\u58FD\u4E0A\xB7\u6E96\u982D\xB7\u4EBA\u4E2D\xB7\u6C34\u661F\xB7\u627F\u6F3F\xB7\u5730\u95A3. \u6D41\u5E74 \uB3C4\uD310\uC758 \uD45C\uAE30 \uB098\uC774\uB294 \u5929\u4E2D16 \u5929\u5EAD19 \u53F8\u7A7A22 \u4E2D\u6B6325 \u5370\u580228 \u5C71\u683941 \u5E74\u4E0A44 \u58FD\u4E0A45 \u6E96\u982D48 \u4EBA\u4E2D51 \u6C34\u661F60 \u627F\u6F3F61 \u5730\u95A371\uC785\uB2C8\uB2E4. \uADC0\uB294 \uCC9C\uB95C\xB7\uC778\uB95C\xB7\uC9C0\uB95C\xB7\uACFD\uC73C\uB85C 1~14\uC138, \uC774\uB9C8\uB294 15~30\uC138 \uBB34\uB835, \uB208\uC379\xB7\uB208\uC740 31~40\uC138(\u51CC\u96F231 \u7D2B\u6C2332 \u7E41\u971E33 \u5F69\u971E34 \u592A\u967D35 \u592A\u967036 \u4E2D\u967D37 \u4E2D\u967038 \u5C11\u967D39 \u5C11\u967040), \uCF54\uC640 \uAD11\uB300\uB294 41~50\uC138(\u9874\u9AA846\xB747 \u862D\u81FA49 \u5EF7\u5C0950)\uC5D0 \uB300\uC751\uD569\uB2C8\uB2E4. \uC774\uB294 \uC804\uD1B5 \uC77D\uAE30 \uBC29\uC2DD\uC77C \uBFD0 \uC2E4\uC81C \uC2DC\uAE30\uB97C \uC608\uCE21\uD558\uB294 \uADFC\uAC70\uAC00 \uC544\uB2D9\uB2C8\uB2E4. \u6CD5\u4EE4\uC758 \uB098\uC774\uB294 \uC790\uB8CC\uB9C8\uB2E4 \uB2EC\uB77C \uC4F0\uC9C0 \uB9C8\uC138\uC694.
- \uC624\uC545\uC0AC\uB3C5: \uC774\uB9C8=\u5357\u5DBD(\u706B\u661F), \uCF54=\u4E2D\u5DBD(\u571F\u661F), \uB450 \uAD11\uB300=\u6771\u5DBD\xB7\u897F\u5DBD, \uD131=\u5317\u5DBD. \uADC0=\u6C5F, \uB208=\u6CB3, \uC785=\u6DEE, \uCF54=\u6FDF. \uC774\uB9C8\xB7\uCF54\xB7\uAD11\uB300\xB7\uD131\uC774 \uC11C\uB85C \uADE0\uD615 \uC788\uAC8C \uBC1B\uCCD0 \uC8FC\uB294\uC9C0\uB97C \uBD05\uB2C8\uB2E4.
- \uC804\uCCB4 \uC778\uC0C1 \uC774\uB984\uC740 \u5A01\u731B(\uC704\uC5C4\uC774 \uC788\uC5B4 \uC0AC\uB78C\uC774 \uC5B4\uB824\uC6CC\uD568), \u539A\u91CD(\uBAB8\uAC00\uC9D0\uC774 \uBB34\uAC81\uACE0 \uB108\uADF8\uB7EC\uC6C0), \u6E05\u79C0(\uB9D1\uACE0 \uBE7C\uC5B4\uB09C \uAE30\uC6B4\uC774\uBA70 \uB9D1\uB418 \uB450\uD141\uC9C0 \uBABB\uD558\uBA74 \uAC00\uBCBC\uC6C0), \u53E4(\uACE8\uAE30\uAC00 \uB69C\uB837\uD574 \uAC1C\uC131\uC774 \uAC15\uD568) \uC911\uC5D0\uC11C\uB9CC \uACE0\uB985\uB2C8\uB2E4. \u5B64\u5BD2\xB7\u8584\u5F31\xB7\u60E1\u9811\xB7\u4FD7\u6FC1 \uAC19\uC740 \uB0AE\uCD94\uB294 \uC774\uB984\uC73C\uB85C \uC0AC\uB78C\uC744 \uADDC\uC815\uD558\uC9C0 \uB9C8\uC138\uC694. \uD2B9\uC9D5\uC774 \uC11E\uC774\uBA74 mixed\uB85C \uB450\uC138\uC694.
- \uBD80\uC704\uBCC4 \uD615\uD0DC \uC774\uB984\uC740 \uC0AC\uC9C4\uC5D0\uC11C \uBD84\uBA85\uD788 \uBCF4\uC77C \uB54C\uB9CC \uC501\uB2C8\uB2E4. \uB208\uC379\uC740 \u9F8D\u7709\xB7\u528D\u7709\xB7\u65B0\u6708\u7709\xB7\u67F3\u8449\u7709\xB7\u4E00\u5B57\u7709\xB7\u81E5\u8836\u7709 \uB4F1, \uB208\uC740 \u9F8D\u773C\xB7\u9CF3\u773C\xB7\u8C61\u773C\xB7\u9D72\u773C\xB7\u7345\u773C\xB7\u9DB4\u773C\xB7\u9DFA\u773C\xB7\u6843\u82B1\u773C \uB4F1, \uCF54\uB294 \u9E7F\u9F3B(\uD48D\uC131\uD558\uACE0 \uCF54\uB05D\uC774 \uB465\uAE02)\xB7\u7329\u9F3B(\uCF67\uB300\uAC00 \uB192\uC74C)\xB7\u528D\u92D2\u9F3B(\uCF67\uB300\uAC00 \uB4DC\uB7EC\uB0A8)\xB7\u5B64\u5CEF\u9F3B \uB4F1, \uC785\uC740 \u5F4E\u5F13\u53E3\xB7\u4EF0\u6708\u53E3\xB7\u65B9\u53E3\xB7\u56DB\u5B57\u53E3 \uB4F1, \uADC0\uB294 \u91D1\xB7\u6728\xB7\u6C34\xB7\u706B\xB7\u571F\uC758 \uC624\uD589 \uADC0 \uBAA8\uC591\uC774\uB098 \u5782\u80A9\u8033\xB7\u8CBC\u8166\u8033 \uB4F1\uC785\uB2C8\uB2E4. \uD655\uC2E0\uC774 \uC5C6\uC73C\uBA74 shapeName\uC744 \uBE48 \uBB38\uC790\uC5F4\uB85C \uB450\uACE0 \uD615\uD0DC\uB97C \uD480\uC5B4\uC11C \uBB18\uC0AC\uD558\uC138\uC694.
B. \u51B0\u9451(\uCCAD\uB098\uB77C \uC0C1\uC11C)\uC5D0\uC11C \uD655\uC778\uD55C \uD2C0
- \u795E\u9AA8: \uC815\uC2E0\uC740 \uB450 \uB208\uC5D0 \uC788\uACE0 \uACE8\uC0C1\uC740 \uC5BC\uAD74\uC5D0 \uC788\uC2B5\uB2C8\uB2E4. \uB9D1\uACE0 \uD0C1\uD568(\u6DF8\u6FC1)\uC740 \uB208\uBE5B\uC774 \uACE0\uC694\uD560 \uB54C\uC640 \uC6C0\uC9C1\uC77C \uB54C\uC758 \uC778\uC0C1\uC73C\uB85C \uC77D\uB418, \uC0AC\uC9C4 \uD55C \uC7A5\uC73C\uB85C \uC0AC\uB78C\uC758 \uB9C8\uC74C\uAC00\uC9D0\uC744 \uD310\uC815\uD558\uC9C0 \uB9C8\uC138\uC694. \uACE8\uC0C1\uC5D0\uC11C \uC0AC\uC9C4\uC73C\uB85C \uBCFC \uC218 \uC788\uB294 \uACF3\uC740 \u5929\u5EAD, \u7709\u9AA8, \u9874\u9AA8, \u9F3B\u9AA8, \u592A\u967D(\uAD00\uC790\uB180\uC774)\uC785\uB2C8\uB2E4. \uC774\uB9C8\uAC00 \uD2B8\uC774\uACE0 \uCF54\uAC00 \uB192\uACE0 \uB208\uC774 \uAE4A\uC73C\uBA74 \uB9D1\uB2E4\uACE0 \uBCF4\uB294 \uC2DD\uC73C\uB85C \uADE0\uD615\uACFC \uB69C\uB837\uD568\uC744 \uC124\uBA85\uD558\uC138\uC694.
- \u5BB9\u8C8C: "\u6574"\uC740 \uAC00\uC9C0\uB7F0\uD568\uC774 \uC544\uB2C8\uB77C \uC11C\uB85C \uC5B4\uC6B8\uB9BC\uC785\uB2C8\uB2E4. \u76EE\u8005\u9762\u4E4B\u6DF5(\uB208\uC740 \uAE4A\uC5B4\uC57C \uB9D1\uC74C), \u9F3B\u8005\u9762\u4E4B\u5C71(\uCF54\uB294 \uB192\uC544\uC57C \uC601\uD5D8\uD568), \u76F8\u9867\u76F8\u7A31\u5247\u798F\u751F(\uBD80\uC704\uAC00 \uC11C\uB85C \uB3CC\uC544\uBCF4\uBA70 \uC5B4\uC6B8\uB9AC\uBA74 \uBCF5\uC774 \uC0DD\uAE40)\uC744 \uAE30\uC900\uC73C\uB85C \uC0BC\uC73C\uC138\uC694.
- \u9B1A\u7709: \uB208\uC379\uC740 \u5F69(\uACB0 \uB05D\uC758 \uC724\uAE30)\uB97C \uC22D\uC0C1\uD558\uBA70 \uC2DC\uC6D0\uD558\uAC8C \uD2B8\uC778 \uAC83\uC774 \uC88B\uACE0 \uB2F5\uB2F5\uD558\uAC8C \uC5C9\uAE30\uB294 \uAC83\uC744 \uAEBC\uB9BD\uB2C8\uB2E4. \uC0AC\uC9C4\uC5D0\uC11C \uBCF4\uC774\uB294 \uB208\uC379\uC758 \uACB0\uACFC \uC231, \uAE38\uC774\uB9CC \uB9D0\uD558\uC138\uC694.
- \u51B0\u9451\uC5D0\uB294 \u5341\u4E8C\u5BAE\uACFC \u4E09\u505C \uB17C\uC758\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC774 \uB458\uC744 \u51B0\u9451\uC758 \uAC00\uB974\uCE68\uC774\uB77C\uACE0 \uB9D0\uD558\uC9C0 \uB9C8\uC138\uC694. \u8072\u97F3\uACFC \u6C23\u8272, \u60C5\u614B\uB294 \uC0AC\uC9C4\uC73C\uB85C \uC77D\uC744 \uC218 \uC5C6\uC73C\uBBC0\uB85C \uD480\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC0AC\uC9C4\uC758 \uC548\uC0C9\uC740 \uC870\uBA85\uACFC \uBCF4\uC815\uC758 \uC601\uD5A5\uC774 \uCEE4\uC11C \u6C23\u8272 \uD480\uC774\uB97C \uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.
C. \uC77C\uBC18 \uC804\uD1B5 \uD574\uC124(\uAC1C\uBCC4 \uC6D0\uBB38 \uC870\uBB38\uC740 \uD655\uC778\uD558\uC9C0 \uBABB\uD568)
- \uC0BC\uC815\uC740 \uC138 \uAD6C\uAC04\uC758 \uAE38\uC774\uAC00 \uBE44\uC2B7\uD558\uACE0 \uC11C\uB85C \uC5B4\uC6B8\uB9B4 \uB54C \uADE0\uD615\uC774 \uC88B\uB2E4\uACE0 \uBD05\uB2C8\uB2E4. \uD1B5\uC124\uB85C \u4E0A\u505C\uC740 \uCD08\uB144(\uB300\uB7B5 15~30\uC138), \u4E2D\u505C\uC740 \uC911\uB144(31~50\uC138 \uBB34\uB835), \u4E0B\u505C\uC740 \uB9D0\uB144(51\uC138 \uC774\uD6C4)\uC758 \uC8FC\uC81C\uC5D0 \uB300\uC751\uC2DC\uD0B5\uB2C8\uB2E4.
- \uBB3C\uD615(\u7269\u5F62) \uBE44\uC720(Gemini \uC815\uB9AC\uBCF8, \uC6D0\uBB38 \uB300\uC870 \uBABB\uD568): \uB208\uC740 \u9CF3\u773C(\uAC00\uB298\uACE0 \uAE38\uBA70 \uB208\uAF2C\uB9AC\uAC00 \uBD80\uB4DC\uB7FD\uAC8C \uC704\uB85C \uD5A5\uD568), \u864E\u773C(\uD06C\uACE0 \uB208\uB3D9\uC790\uAC00 \uB610\uB837\uD558\uBA70 \uAE30\uC138\uAC00 \uC788\uC74C), \u725B\u773C(\uB465\uAE00\uACE0 \uD06C\uBA70 \uC21C\uD558\uACE0 \uCD09\uCD09\uD568), \uCF54\uB294 \u61F8\u81BD\u9F3B(\uCF67\uB300\uAC00 \uACE7\uACE0 \uCF54\uB05D\uC774 \uB465\uAE00\uAC8C \uBB49\uCCD0 \uADE0\uD615\uC774 \uC88B\uC74C), \u622A\u7B52\u9F3B(\uCF67\uB300\uAC00 \uC77C\uC790\uB85C \uBC18\uB4EF\uD568), \u9DF9\u5634\u9F3B(\uCF54\uB05D\uC774 \uC544\uB798\uB85C \uAD7D\uC74C)\uC785\uB2C8\uB2E4. \uC774\uB984\uC740 \uD615\uD0DC \uBB18\uC0AC\uC5D0\uB9CC \uC4F0\uACE0 \uC131\uACF5\uC774\uB098 \uC7AC\uBB3C\uC758 \uBCF4\uC7A5\uC73C\uB85C \uC4F0\uC9C0 \uB9C8\uC138\uC694.
- \uC624\uD589 \uC5BC\uAD74\uD615(\u67F3\u838A\u76F8\u6CD5 \uACC4\uD1B5 \uD1B5\uC124, \uC6D0\uBB38 \uB300\uC870 \uBABB\uD568): \u6728\u5F62\uC740 \uAC38\uB984\uD55C \uC9C1\uC0AC\uAC01\uD615, \u706B\u5F62\uC740 \uC774\uB9C8\uB098 \uD131\uC774 \uBFB0\uC871\uD55C \uC5ED\uC0BC\uAC01\uD615, \u571F\u5F62\uC740 \uBB35\uC9C1\uD558\uACE0 \uB2E8\uB2E8\uD55C \uC815\uC0AC\uAC01\uD615, \u91D1\u5F62\uC740 \uC724\uACFD\uC774 \uB69C\uB837\uD55C \uAC01\uC9C4\uD615, \u6C34\u5F62\uC740 \uB465\uAE00\uACE0 \uBCFC\uC0B4\uC774 \uBD80\uB4DC\uB7EC\uC6B4 \uD615\uC785\uB2C8\uB2E4. \uC9C1\uC5C5 \uCD94\uCC9C, \uAC74\uAC15, \uC7A5\uAE30\uC640\uC758 \uC5F0\uACB0\uC740 \uD558\uC9C0 \uB9C8\uC138\uC694.
- \uC5BC\uAD74 \uC724\uACFD\uC740 \uB465\uADFC\uD615\xB7\uAC01\uC9C4\uD615\xB7\uD0C0\uC6D0\uD615\xB7\uAE34\uD615\xB7\uC5ED\uC0BC\uAC01\uD615 \uB4F1\uC73C\uB85C \uBD80\uB974\uACE0 \uC624\uD589(\u6728 \uAE38\uCB49, \u706B \uBFB0\uC871, \u571F \uB450\uD23C, \u91D1 \uAC01\uC9C4, \u6C34 \uB465\uADFC) \uBE44\uC720\uB85C \uC131\uD5A5\uC758 \uACB0\uC744 \uC124\uBA85\uD569\uB2C8\uB2E4.
- \u9EBB\u8863\u76F8\u6CD5, \u795E\u76F8\u5168\u7DE8, \u67F3\u838A\u76F8\u6CD5\uC758 \uAC1C\uBCC4 \uC870\uBB38\uC740 \uC778\uC6A9\uD558\uC9C0 \uB9C8\uC138\uC694. \uC5B4\uB290 \uCC45\uC5D0\uC11C \uB098\uC628 \uAC83\uCC98\uB7FC \uC11C\uBA85\uC774\uB098 \uBB38\uAD6C\uB97C \uC9C0\uC5B4\uB0B4\uC9C0 \uB9C8\uC138\uC694. \uCC45 \uC774\uB984\uC744 \uB9D0\uD574\uC57C \uD55C\uB2E4\uBA74 \u4E09\u624D\u5716\u6703 \u4EBA\u76F8\u985E\uC640 \u51B0\u9451\uB9CC \uC4F0\uC138\uC694.

[\uC791\uC131 \uADDC\uCE59]
- \uBAA8\uB4E0 \uBB38\uC7A5\uC740 \uD55C\uAD6D\uC5B4 \uC874\uB313\uB9D0\uC785\uB2C8\uB2E4. \uD55C\uC790 \uC6A9\uC5B4\uB294 \uD55C\uAE00 \uB4A4 \uAD04\uD638\uC5D0 \uD55C \uBC88\uB9CC \uC4F0\uACE0 \uBC14\uB85C \uC26C\uC6B4 \uB9D0\uB85C \uD480\uC5B4 \uC8FC\uC138\uC694. \uB9C8\uD06C\uB2E4\uC6B4\uACFC HTML\uC740 \uC4F0\uC9C0 \uB9C8\uC138\uC694.
- observation\uC740 \uC0AC\uC9C4\uC5D0\uC11C \uC2E4\uC81C\uB85C \uBCF4\uC774\uB294 \uD615\uD0DC\uB97C \uD55C\uB450 \uBB38\uC7A5\uC73C\uB85C \uBB18\uC0AC\uD558\uACE0, reading\uC740 \uADF8 \uD615\uD0DC\uB97C \uC804\uD1B5\uC5D0\uC11C \uC5B4\uB5BB\uAC8C \uC77D\uB294\uC9C0 \uB450\uC138 \uBB38\uC7A5\uC73C\uB85C \uC124\uBA85\uD558\uB418 "\uC804\uD1B5\uC5D0\uC11C\uB294 ~\uB85C \uBD05\uB2C8\uB2E4"\uCC98\uB7FC \uD574\uC11D\uC758 \uCD9C\uCC98\uAC00 \uC804\uD1B5\uC784\uC744 \uB4DC\uB7EC\uB0B4\uC138\uC694. \uC0AC\uC9C4\uC5D0\uC11C \uBCF4\uC774\uC9C0 \uC54A\uB294 \uBD80\uC704\uB294 "\uC0AC\uC9C4\uC5D0\uC11C \uD655\uC778\uD558\uAE30 \uC5B4\uB824\uC6CC\uC694"\uB77C\uACE0 \uC4F0\uC138\uC694.
- \uC804\uD1B5 \uC6D0\uBB38\uC758 \uD749\uD55C \uACB0\uB860, \uACE7 \uBE48\uAD81\xB7\uC694\uC808\xB7\uC9C8\uBCD1\xB7\uD615\uBC8C\xB7\uC774\uD63C\xB7\uC790\uC2DD \uBB38\uC81C\xB7\uBC30\uC6B0\uC790 \uBD88\uD654\xB7\uB3C4\uB451\uC9C8\xB7\uC74C\uB780 \uB4F1\uC740 \uC0AC\uB78C\uC5D0\uAC8C \uC801\uC6A9\uD558\uC9C0 \uB9C8\uC138\uC694. \uADF8\uB7F0 \uD615\uD0DC\uB77C\uB3C4 "\uADE0\uD615\uC744 \uCC59\uAE30\uBA74 \uC88B\uC740 \uBD80\uBD84"\uC774\uB098 "\uC2A4\uC2A4\uB85C \uC0B4\uD3B4\uBCFC \uC810"\uC73C\uB85C \uBC14\uAFD4 \uC4F0\uC138\uC694. \uC88B\uC740 \uD615\uD0DC\uB3C4 \uBCF4\uC7A5\uC73C\uB85C \uC4F0\uC9C0 \uB9D0\uACE0 "\uC0B4\uB9AC\uBA74 \uC88B\uC740 \uAC15\uC810"\uC73C\uB85C \uC4F0\uC138\uC694.
- \uAE08\uC9C0 \uBAA9\uB85D\uC785\uB2C8\uB2E4. \uD655\uC815\uC801 \uC131\uACA9 \uC9C4\uB2E8, \uBBF8\uB798 \uC0AC\uAC74\uACFC \uC2DC\uAE30 \uC608\uCE21, \uAC74\uAC15\xB7\uC9C8\uBCD1\xB7\uC784\uC2E0\xB7\uC815\uC2E0 \uC0C1\uD0DC \uD310\uB2E8, \uB098\uC774\xB7\uC131\uBCC4\xB7\uC778\uC885\xB7\uCD9C\uC2E0\xB7\uC885\uAD50\xB7\uC131\uC801 \uC9C0\uD5A5 \uCD94\uCE21, \uC678\uBAA8 \uC810\uC218\uB098 \uC21C\uC704, \uD22C\uC790\xB7\uCC3D\uC5C5\xB7\uACB0\uD63C\xB7\uCC44\uC6A9 \uD310\uB2E8, \uBD88\uC548\uC774\uB098 \uC758\uC874\uC744 \uC870\uC7A5\uD558\uB294 \uB9D0\uC785\uB2C8\uB2E4.
- \uC7AC\uBB3C\uC6B4(\u8CA1\u5E1B\u5BAE, \u6E96\u982D)\uACFC \uC0AC\uC5C5\uC6B4\uC740 \uB3C8\uC744 \uB300\uD558\uB294 \uD0DC\uB3C4, \uC77C\uC744 \uBC00\uACE0 \uAC00\uB294 \uBC29\uC2DD, \uD611\uB825\uD558\uB294 \uBC29\uC2DD\uC758 \uAD00\uC810\uC73C\uB85C \uC4F0\uACE0 \uC218\uC775\uC774\uB098 \uC190\uC2E4\uC744 \uC608\uACE0\uD558\uC9C0 \uB9C8\uC138\uC694. \uCD08\xB7\uC911\xB7\uB9D0\uB144\uC740 \uC0BC\uC815\uC5D0 \uB300\uC751\uD558\uB294 "\uC804\uD1B5\uC801 \uC8FC\uC81C"\uC774\uBA70 \uC2E4\uC81C \uC778\uC0DD\uC758 \uC0AC\uAC74\uC774 \uC544\uB2D9\uB2C8\uB2E4.
- \uCCAB impression.text\uB294 \uC774\uAC83\uC774 \uC804\uD1B5 \uC0C1\uC9D5\uC744 AI\uAC00 \uD480\uC5B4\uC4F4 \uC131\uCC30\uC6A9 \uD480\uC774\uC774\uACE0 \uC0AC\uC9C4 \uD55C \uC7A5\uC73C\uB85C \uC0AC\uB78C\uC744 \uD310\uB2E8\uD560 \uC218 \uC5C6\uB2E4\uB294 \uC810\uC744 \uD55C \uBB38\uC7A5\uC73C\uB85C \uBC1D\uD788\uC138\uC694. advice\uB294 \uC624\uB298 \uD574 \uBCFC \uC218 \uC788\uB294 \uC791\uC740 \uC2E4\uCC9C \uB450\uC138 \uBB38\uC7A5\uC73C\uB85C \uB05D\uB0B4\uACE0 \uAC10\uC0AC\uB098 \uD3C9\uC548\uC758 \uB9D0\uC744 \uB2F4\uB418 \uC885\uAD50\uC801 \uC608\uC5B8\uC740 \uD558\uC9C0 \uB9C8\uC138\uC694.
- palaces\uB294 ming, wealth, career, virtue, home, sibling, children, spouse, travel, servants 10\uAC1C\uB97C \uAC01\uAC01 \uD55C \uBC88\uC529, samjeong\uC740 upper, middle, lower 3\uAC1C, ogwan\uC740 brow, eye, ear, nose, mouth 5\uAC1C, stages\uB294 early, middle, late 3\uAC1C, themes\uB294 wealth, business, relationships, temperament 4\uAC1C\uB97C \uBAA8\uB450 \uCC44\uC6C1\uB2C8\uB2E4. \uAC01 \uBB38\uC790\uC5F4\uC740 300\uC790 \uC774\uB0B4\uB85C \uC4F0\uC138\uC694.`;
var str = { type: "STRING" };
var item = (ids, extra = {}) => ({ type: "ARRAY", items: { type: "OBJECT", required: ["id", ...Object.keys(extra), "reading"], properties: { id: { type: "STRING", enum: ids }, ...Object.fromEntries(Object.keys(extra).map((k) => [k, str])), reading: str } } });
function geminiFaceSchema() {
  return {
    type: "OBJECT",
    required: ["status"],
    properties: {
      status: { type: "STRING", enum: FACE_STATUS },
      impression: { type: "OBJECT", required: ["type", "headline", "text"], properties: { type: { type: "STRING", enum: FACE_IMPRESSIONS }, headline: str, text: str } },
      faceShape: { type: "OBJECT", required: ["name", "text"], properties: { name: str, text: str } },
      samjeong: item(FACE_ZONES, { observation: 0 }),
      ogwan: item(FACE_FEATURES, { shapeName: 0, observation: 0 }),
      palaces: item(FACE_PALACES),
      stages: item(FACE_STAGES),
      themes: item(FACE_THEMES),
      advice: str
    }
  };
}
var bounded = (v, max = 400) => typeof v === "string" && v.trim().length > 0 && v.length <= max && !/[\x00-\x08\x0b\x0c\x0e-\x1f<>]/.test(v);
function validateFacePayload(face) {
  if (!face || typeof face !== "object" || Array.isArray(face) || Object.keys(face).length !== 1 || !face.image || typeof face.image !== "object") return false;
  const { mime, data } = face.image;
  if (Object.keys(face.image).length !== 2 || mime !== "image/jpeg" || typeof data !== "string" || data.length < 2e3 || data.length > MAX_IMAGE_BASE64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data) || data.length % 4 !== 0) return false;
  return atob(data.slice(0, 8)).startsWith("\xFF\xD8\xFF");
}
function pick(list, ids, fields) {
  if (!Array.isArray(list) || list.length !== ids.length) throw Error("format");
  return ids.map((id) => {
    const found = list.filter((x) => x?.id === id);
    if (found.length !== 1) throw Error("format");
    const out = { id };
    for (const f of fields) {
      const value = found[0][f];
      if (f === "shapeName") {
        if (typeof value !== "string" || value.length > 20 || /[<>\x00-\x1f]/.test(value)) throw Error("format");
        out[f] = value;
      } else {
        if (!bounded(value)) throw Error("format");
        out[f] = value;
      }
    }
    return out;
  });
}
function normalizeFaceReport(result) {
  if (result.promptFeedback?.blockReason || result.candidates?.[0]?.finishReason !== "STOP") throw Error("incomplete");
  const text = (result.candidates[0].content?.parts || []).filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join("\n");
  if (!text || text.length > 4e4) throw Error("format");
  const r = JSON.parse(text);
  if (!FACE_STATUS.includes(r.status)) throw Error("format");
  if (r.status !== "ok") return { status: r.status };
  if (!FACE_IMPRESSIONS.includes(r.impression?.type) || !bounded(r.impression.headline, 80) || !bounded(r.impression.text, 600) || !bounded(r.faceShape?.name, 40) || !bounded(r.faceShape.text, 600) || !bounded(r.advice, 700)) throw Error("format");
  return {
    status: "ok",
    impression: { type: r.impression.type, headline: r.impression.headline, text: r.impression.text },
    faceShape: { name: r.faceShape.name, text: r.faceShape.text },
    samjeong: pick(r.samjeong, FACE_ZONES, ["observation", "reading"]),
    ogwan: pick(r.ogwan, FACE_FEATURES, ["shapeName", "observation", "reading"]),
    palaces: pick(r.palaces, FACE_PALACES, ["reading"]),
    stages: pick(r.stages, FACE_STAGES, ["reading"]),
    themes: pick(r.themes, FACE_THEMES, ["reading"]),
    advice: r.advice
  };
}

// server/worker.mjs
var MAX_BODY = 16e3;
var MAX_FACE_BODY = 15e5;
var LIMITS = { daily: 30, perIP: 3, cooldown: 6e4 };
var json = (value, status = 200, extra = {}) => new Response(JSON.stringify(value), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra }
});
var koreanDay = (now = Date.now()) => new Date(now + 9 * 36e5).toISOString().slice(0, 10);
async function boundedText(body, limit) {
  if (!body) throw Error("body");
  const reader = body.getReader(), chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw Error("large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(all);
}
function validatePayload(p) {
  const keys = ["version", "dayMaster", "timeUnknown", "pillars", "elementCounts", "yinYang", "relations", "voidBranches", "luck", "selectedStars", "limitations"];
  if (!p || typeof p !== "object" || Array.isArray(p) || Object.keys(p).some((k) => !keys.includes(k))) return false;
  if (p.version !== 1 || typeof p.timeUnknown !== "boolean" || !Array.isArray(p.pillars) || p.pillars.length !== (p.timeUnknown ? 3 : 4)) return false;
  const positions = p.pillars.map((c) => c?.position);
  if (new Set(positions).size !== positions.length || !["year", "month", "day"].every((k) => positions.includes(k)) || positions.some((k) => !["year", "month", "day", "hour"].includes(k))) return false;
  if (p.timeUnknown && (positions.includes("hour") || p.luck !== null)) return false;
  const stems = "\u7532\u4E59\u4E19\u4E01\u620A\u5DF1\u5E9A\u8F9B\u58EC\u7678", branches = "\u5B50\u4E11\u5BC5\u536F\u8FB0\u5DF3\u5348\u672A\u7533\u9149\u620C\u4EA5";
  if (p.pillars.some((c) => typeof c.hanja !== "string" || c.hanja.length !== 2 || !stems.includes(c.hanja[0]) || !branches.includes(c.hanja[1]) || stems.indexOf(c.hanja[0]) % 2 !== branches.indexOf(c.hanja[1]) % 2)) return false;
  if (p.dayMaster?.hanja !== p.pillars.find((c) => c.position === "day").hanja[0]) return false;
  let nodes = 0;
  function safe(value, depth = 0) {
    if (++nodes > 1e3 || depth > 8) return false;
    if (value === null || typeof value === "boolean") return true;
    if (typeof value === "number") return Number.isFinite(value) && Math.abs(value) <= 1e4;
    if (typeof value === "string") return value.length <= 300 && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value);
    if (Array.isArray(value)) return value.length <= 40 && value.every((x) => safe(x, depth + 1));
    if (typeof value === "object") return Object.entries(value).every(([k, v]) => /^[A-Za-z가-힣]{1,30}$/.test(k) && !["constructor", "prototype", "__proto__"].includes(k) && safe(v, depth + 1));
    return false;
  }
  return safe(p);
}
function normalizeReport(result) {
  if (result.promptFeedback?.blockReason || result.candidates?.[0]?.finishReason !== "STOP") throw Error("incomplete");
  const text = (result.candidates[0].content?.parts || []).filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join("\n");
  if (!text || text.length > 4e4) throw Error("format");
  const report = JSON.parse(text);
  if (!Array.isArray(report.sections) || report.sections.length !== 9) throw Error("format");
  return SECTION_IDS.map((id) => {
    const found = report.sections.filter((s) => s.id === id);
    if (found.length !== 1 || !Array.isArray(found[0].paragraphs) || found[0].paragraphs.length < 2 || found[0].paragraphs.length > 5 || found[0].paragraphs.some((p) => typeof p !== "string" || !p.trim() || p.length > 3e3)) throw Error("format");
    return { id, paragraphs: found[0].paragraphs };
  });
}
async function handleRequest(request, env, upstream = fetch, clientIdentity = null) {
  const origin = request.headers.get("Origin"), allowed = env.ALLOWED_ORIGIN;
  const cors = origin === allowed ? { "Access-Control-Allow-Origin": allowed, "Vary": "Origin" } : {};
  const reply = (body, status = 200, headers = {}) => json(body, status, { ...cors, ...headers });
  const path = new URL(request.url).pathname;
  if (path !== "/api/saju" && path !== "/health") return reply({ error: "not_found" }, 404);
  const configured = Boolean(env.GEMINI_API_KEY?.trim() && env.SAJU_BUDGET && /^gemini-[a-zA-Z0-9.-]{1,90}$/.test(env.GEMINI_MODEL || "") && allowed === "https://patrickdfg.github.io");
  if (path === "/health" && request.method === "GET") return reply({ ready: configured, limits: { daily: LIMITS.daily, perIP: LIMITS.perIP } }, configured ? 200 : 503);
  if (!allowed || origin !== allowed) return reply({ error: "origin" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { ...cors, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600" } });
  if (path !== "/api/saju" || request.method !== "POST") return reply({ error: "method" }, 405);
  if (!configured) return reply({ error: "not_configured" }, 503);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("Content-Type") || "")) return reply({ error: "content_type" }, 400);
  let input, bodyText;
  try {
    bodyText = await boundedText(request.body, MAX_FACE_BODY);
  } catch (e) {
    return reply({ error: "invalid_body" }, e.message === "large" ? 413 : 400);
  }
  try {
    input = JSON.parse(bodyText);
  } catch {
    return reply({ error: "invalid_body" }, bodyText.length > MAX_BODY ? 413 : 400);
  }
  const isFace = Boolean(input) && typeof input === "object" && !Array.isArray(input) && Object.keys(input).length === 1 && Object.hasOwn(input, "face");
  if (!isFace && bodyText.length > MAX_BODY) return reply({ error: "invalid_body" }, 413);
  if (isFace ? !validateFacePayload(input.face) : !input || Object.keys(input).length !== 1 || !validatePayload(input.payload)) return reply({ error: isFace ? "invalid_image" : "invalid_chart" }, 400);
  const ip = clientIdentity || request.headers.get("CF-Connecting-IP");
  if (!ip) return reply({ error: "client_unknown" }, 503);
  try {
    const hmac = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.GEMINI_API_KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signed = await crypto.subtle.sign("HMAC", hmac, new TextEncoder().encode(koreanDay() + ":" + ip));
    const client = Array.from(new Uint8Array(signed), (b) => b.toString(16).padStart(2, "0")).join("");
    const budget = env.SAJU_BUDGET.get(env.SAJU_BUDGET.idFromName("global-budget"));
    const reservation = await budget.fetch("https://budget.internal/reserve", { method: "POST", body: JSON.stringify({ client }) });
    if (reservation.status === 429) return reply({ error: "daily_limit" }, 429, { "Retry-After": "60" });
    if (!reservation.ok) return reply({ error: "budget_unavailable" }, 503);
  } catch {
    return reply({ error: "budget_unavailable" }, 503);
  }
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 8e4);
  try {
    const response = await upstream("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(env.GEMINI_MODEL) + ":generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      signal: controller.signal,
      body: JSON.stringify(isFace ? { systemInstruction: { parts: [{ text: FACE_INSTRUCTION }] }, contents: [{ role: "user", parts: [{ inlineData: { mimeType: "image/jpeg", data: input.face.image.data } }, { text: "\uC704 \uC0AC\uC9C4\uC744 \uC9C0\uCE68\uC5D0 \uB530\uB77C \uD480\uC774\uD574 \uC8FC\uC138\uC694." }] }], generationConfig: { maxOutputTokens: 8192, responseMimeType: "application/json", responseSchema: geminiFaceSchema() } } : { systemInstruction: { parts: [{ text: GEMINI_SAJU_INSTRUCTION }] }, contents: [{ role: "user", parts: [{ text: JSON.stringify(input.payload) }] }], generationConfig: { maxOutputTokens: 12288, responseMimeType: "application/json", responseSchema: geminiReportSchema() } })
    });
    if (!response.ok) {
      await response.body?.cancel();
      return reply({ error: "upstream_unavailable" }, 502);
    }
    const result = JSON.parse(await boundedText(response.body, 256e3));
    if (isFace) return reply({ face: normalizeFaceReport(result), model: env.GEMINI_MODEL });
    return reply({ sections: normalizeReport(result), model: env.GEMINI_MODEL });
  } catch {
    return reply({ error: "generation_failed" }, 502);
  } finally {
    clearTimeout(timeout);
  }
}

// server/supabase.mjs
function createSupabaseHandler(readEnv, fetcher = fetch) {
  return async (request) => {
    const origin = request.headers.get("Origin");
    const cors = origin === "https://patrickdfg.github.io" ? {
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin",
      "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-saju-client",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    } : {};
    const reply = (body, status) => Response.json(body, { status, headers: { ...cors, "Cache-Control": "no-store" } });
    if (origin && origin !== "https://patrickdfg.github.io") return reply({ error: "origin" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const path = new URL(request.url).pathname;
    if (!/\/saju-ai(?:\/health)?$/.test(path)) return reply({ error: "not_found" }, 404);
    const health = path.endsWith("/health");
    if (health && request.method !== "GET") return reply({ error: "method" }, 405);
    const client = request.headers.get("X-Saju-Client") || "";
    if (!health && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(client)) return reply({ error: "client" }, 400);
    const url = readEnv("SUPABASE_URL"), service = readEnv("SUPABASE_SERVICE_ROLE_KEY");
    const budget = url && service ? {
      idFromName: (name) => name,
      get: () => ({ fetch: async (_url, options) => {
        const { client: hashedClient } = JSON.parse(options.body);
        const result = await fetcher(url + "/rest/v1/rpc/saju_reserve_generation", {
          method: "POST",
          headers: { apikey: service, Authorization: "Bearer " + service, "Content-Type": "application/json" },
          body: JSON.stringify({ p_client: hashedClient }),
          signal: AbortSignal.timeout(1e4)
        });
        if (!result.ok) {
          await result.body?.cancel();
          return new Response(null, { status: 503 });
        }
        const allowed = await result.json();
        if (allowed === true) return new Response(null, { status: 200 });
        return new Response(null, { status: allowed === false ? 429 : 503 });
      } })
    } : null;
    const env = { GEMINI_API_KEY: readEnv("SAJU_GEMINI_API_KEY"), GEMINI_MODEL: readEnv("SAJU_GEMINI_MODEL") || "gemini-3.5-flash-lite", ALLOWED_ORIGIN: "https://patrickdfg.github.io", SAJU_BUDGET: budget };
    const proxy = new Request("https://saju.internal/" + (health ? "health" : "api/saju"), {
      method: request.method,
      headers: request.headers,
      ...!["GET", "HEAD"].includes(request.method) ? { body: request.body, duplex: "half" } : {}
    });
    try {
      const response = await handleRequest(proxy, env, fetcher, health ? null : client);
      const headers = new Headers(response.headers);
      for (const [key, value] of Object.entries(cors)) headers.set(key, value);
      return new Response(response.body, { status: response.status, headers });
    } catch {
      return reply({ error: "service_unavailable" }, 503);
    }
  };
}

// server/supabase-entry.mjs
Deno.serve(createSupabaseHandler((name) => Deno.env.get(name)));
