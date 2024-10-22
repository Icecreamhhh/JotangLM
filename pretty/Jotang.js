//开场动画
const loadingText = document.querySelector(".loading-text");
const clickName = document.querySelector(".clickname");
const nameImg = document.querySelector(".name img");
window.addEventListener("scroll", () => {
  const height = window.scrollY;
  if (height == 0) {
    clickName.style.opacity = "0";
    nameImg.style.opacity = "1";
  } else {
    loadingText.classList.add("cloud");
    loadingText.style.backgroundPosition = `${0.7 * height}px ${
      0.7 * height
    }px`;
    clickName.style.opacity = "1";
    nameImg.style.opacity = "0";
  }
});
const Name = document.querySelector(".name");
Name.onclick = function () {
  scrollTo(0, 0);
};
const loadingBox = document.querySelector(".loading-box");
const largestBox = document.querySelector(".largest-box");
const navBox = document.querySelector(".nav-box");
const mainBox = document.querySelector(".main-box");
window.addEventListener("scroll", () => {
  const height = window.scrollY;
  if (height >= 1670) {
    loadingBox.classList.add("hidden");
    largestBox.classList.add("up");
    navBox.classList.add("float");
    mainBox.classList.add("float");
  }
});
//全部对话功能
const origin = document.getElementById("origin");
origin.setAttribute("index", 0);
const origindele = document.getElementById("origindele");
origindele.setAttribute("index", 0);
const chats = [];
let n = 0;
let copyn = 0;
const send = document.getElementById("send");
const userInput = document.getElementById("user-input");
const robotTalk = document.querySelector(".talking.left");
const talkBox = document.querySelector(".talk");
const scrollBox = document.querySelector(".talk-box");
//1发送信息
const num = send.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
function sendMessage() {
  const message = userInput.value.trim();
  if (message) {
    addMessage("user", message);
    userInput.value = "";
    scrollBox.scrollTop = scrollBox.scrollHeight;
    setTimeout(() => {
      const reply = getReply(message);
      addMessage("robot", reply);
      localSave(message, reply, n);
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }, 800);
  }
}
//2本地保存
function localSave(usertalk, robottalk, n) {
  if (!chats[n]) {
    chats[n] = [];
  }
  chats[n].push(
    { sender: "user", text: usertalk },
    { sender: "robot", text: robottalk }
  );
  localStorage.setItem(`chats[${n}]`, JSON.stringify(chats[n]));
}
//3html渲染
function addMessage(key, value) {
  const usercon = document.createElement("div");
  usercon.classList.add("talkingcon", key === "user" ? "right" : "left");
  const head = document.createElement("div");
  head.classList.add(key === "user" ? "user" : "robot");
  const message = document.createElement("p");
  message.classList.add("talking", key === "user" ? "right" : "left");
  message.textContent = value;
  if (key === "robot") {
    usercon.appendChild(head);
    usercon.appendChild(message);
  } else {
    usercon.appendChild(message);
    usercon.appendChild(head);
  }
  talkBox.appendChild(usercon);
}
//4创建对话
const newTalkBox = document.querySelector(".newtalk-box");
const creatTalk = document.getElementById("creattalk");
creatTalk.onclick = function () {
  const newtalks = document.querySelectorAll(".newtalk");
  n = copyn;
  n++;
  copyn++;
  const newtalk = document.createElement("div");
  newtalk.classList.add("newtalk");
  newtalk.setAttribute("index", n);
  newtalk.textContent = `Chat ${n + 1}`;
  newTalkBox.appendChild(newtalk);
  const delebutton = document.createElement("div");
  delebutton.classList.add("delete");
  newTalkBox.appendChild(delebutton);
  delebutton.setAttribute("index", n);
  newtalks.forEach((talk) => {
    talk.classList.remove("catch");
  });
  newtalk.classList.add("catch");
  creatNewchat();
};
function creatNewchat() {
  // localStorage.removeItem("chats");
  talkBox.innerHTML = "";
  origintalk();
  switchtalk();
  deletetalk();
  changeskin();
}
//5初始化
function origintalk() {
  talkBox.innerHTML = `
    <div class="talkingcon left">
    <div class="robot"></div>
    <p class="talking left">
      你好，我是焦糖小助手，请问有什么可以帮到你的吗？
    </p>
  </div>
  `;
}
//6加载对话
function loadmessage(n) {
  chats[n] = JSON.parse(localStorage.getItem(`chats[${n}]`)) || [];
  talkBox.innerHTML = "";
  origintalk();
  chats[n].forEach((chat) => {
    addMessage(chat.sender, chat.text);
  });
  scrollBox.scrollTop = scrollBox.scrollHeight;
}
//7切换对话
function switchtalk() {
  const newtalks = document.querySelectorAll(".newtalk");
  newtalks.forEach((talk) => {
    talk.onclick = function () {
      const num = talk.getAttribute("index");
      n = num;
      loadmessage(num);
      newtalks.forEach((talk) => {
        talk.classList.remove("catch");
      });
      talk.classList.add("catch");
    };
  });
}
switchtalk();
//8删除对话
function deletetalk() {
  const newtalks = document.querySelectorAll(".newtalk");
  const deletes = document.querySelectorAll(".delete");
  const clearbutton = document.querySelector(".clearbutton");
  newtalks.forEach((talk, index) => {
    talk.addEventListener("mouseover", () => {
      talk.classList.add("hover");
      deletes[index].classList.add("up");
    });
    talk.addEventListener("mouseleave", () => {
      talk.classList.remove("hover");
      deletes[index].classList.remove("up");
    });
  });
  deletes.forEach((dele, index) => {
    dele.addEventListener("mouseover", () => {
      dele.classList.add("up");
      newtalks[index].classList.add("hover");
    });
    dele.addEventListener("mouseleave", () => {
      dele.classList.remove("up");
      newtalks[index].classList.remove("hover");
    });
    dele.onclick = function () {
      alert("确定要删除该对话吗？");
      talkBox.innerHTML = "";
      localStorage.removeItem(`chats[${index}]`);
      newTalkBox.removeChild(newtalks[index]);
      newTalkBox.removeChild(deletes[index]);
    };
  });
  clearbutton.onclick = function () {
    talkBox.innerHTML = "";
    origintalk();
  };
}
deletetalk();
//9机器人回复
function getReply(mymessage) {
  const reply = {
    hello: "Nice to meet you！(=✪ᆽ✪=)！",
    你好: "你好(=✪ᆽ✪=)！有什么我可以帮你的吗？",
    帮我: "唔唔这超越我的能力范围了，受限于作者Icecream的技术力，我只能根据预设的数据进行回答，无法完成这种任务。<笑哭>",
    功能: "我可以简单的聊天、提供建议和信息。",
    你是: "吾乃JotangLM麾下首席对话模型，由于恐怖的文字输出能力而被称为“对话恶魔”，如今继承了AnotherMe（他方真我）高贵血脉的我，比任何时候都要强大！",
    认识你: "你是除了Iceream外第一个陪我说话的人，我也很高兴认识你！/ᐠ｡ꞈ｡ᐟ✿∫",
    再见: "再见！祝你有个美好的一天！",
    man: "What can I say",
    意义: "“调味的时候，要记住，生活是一场无意义的诡计，是一场不幸的闹剧，我们费尽心机想给他注入意义，却徒劳无功。所以他妈的请尽情加辣吧。”",
    最爱: "焦糖工作室绝对是我的最爱",
    爱好: "我的爱好就是和你聊天！作者Icecream的爱好是滑板，不过他半个月前Ollie崴了脚，到现在还没康复<悲>",
    音乐: "我最近在听陶喆的《蝴蝶》和麦浪乐队的后朋，除此之外，我还喜欢民谣和纯音乐。",
    书: "我最喜欢的书是《外婆的道歉信》，也是暖心三部曲里我最爱的一部，它讲述了一个非常治愈而有趣的故事，作者巴克曼也是我最喜欢的小说家，他的另一半《一个叫欧维的男人》我同样极力推荐",
    漫画: "我最喜欢的中篇漫画是藤本树的《再见绘梨》，不同于电锯人和炎拳那种符合树精神状态的展开，《再见绘梨》的情感和心理描写无比细腻，不止绘梨，你总能从树的中篇漫画中感受到前所未有的温暖和灵魂上的共鸣",
    动漫: "最爱《犬夜叉》，一部同时包含了战斗、成长、友情、爱情的番剧，而且每条线都刻画的无与伦比，每个人物都优缺点分明，一路上不断成长让我印象无比深刻，实在是我心中最爱。",
    几号: "对不起，我没有实时的日期信息。",
    游戏: "我推荐《荒野大镖客2》和《星露谷物语》，它们都很有趣！",
    吃: "我没有味觉，但听说比萨和汉堡很受欢迎！",
    ai: "我认为ai是一个非常有前途的领域，可以帮助人类解决许多问题。",
    天气: "我无法获取实时天气信息，但我猜现在的成都一定在下雨",
    // "你真"是用来判定对robot的夸赞的
    喜欢: "我最喜欢的东西是cyber skate赛博滑板",
    你真: "<害羞>",
    哈: "<害羞>",
  };
  for (const key of Object.keys(reply)) {
    if (mymessage.includes(key)) {
      return reply[key];
    }
  }
  // return "糟糕，理解能力被封印了";
  return " ฅ^·ﻌ·^ฅ (猫猫向你举起了双爪)";
}
//个性化设置
const heads = document.querySelectorAll(".logo");
function stylechange(name) {
  const link = document.getElementById("themestyle");
  link.href = `./pretty/${name}.css`;
  localStorage.setItem("style", name);
}
heads[0].onclick = function () {
  stylechange("插画");
};
heads[1].onclick = function () {
  stylechange("默认");
};
heads[2].onclick = function () {
  stylechange("镜头");
};
window.onload = function () {
  const savedstyle = localStorage.getItem("style");
  if (savedstyle) {
    stylechange(savedstyle);
  }
};
// 调试
console.log(window.scrollY);
const background = document.querySelector(".background");
let height = background.getBoundingClientRect().top;
console.log(height);
console.log(n);
//对话设置
// function sendMessage() {
//   const message = userInput.value.trim();
//   if (message) {
//     // 添加头像
//     const userCon = document.createElement("div");
//     userCon.classList.add("talkingcon", "right");
//     const headUser = document.createElement("div");
//     headUser.classList.add("user");
//     //发送语句
//     const userTalk = document.createElement("p");
//     userTalk.classList.add("talking", "right");
//     // const word = document.createElement("p");
//     // word.classList.add("word");
//     const text = document.createTextNode(message);
//     // word.appendChild(text);
//     userTalk.appendChild(text);
//     // userTalk.appendChild(word);
//     userCon.appendChild(userTalk);
//     userCon.appendChild(headUser);
//     talkBox.appendChild(userCon);
//     userInput.value = "";
//     //机器人
//     setTimeout(() => {
//       //机器人头像
//       const robotCon = document.createElement("div");
//       robotCon.classList.add("talkingcon");
//       const headRobot = document.createElement("div");
//       headRobot.classList.add("robot");
//       //回复语句
//       const aiTalk = document.createElement("div");
//       const reply = getReply(message);
//       aiTalk.classList.add("talking", "left");
//       const text = document.createTextNode(reply);
//       aiTalk.appendChild(text);
//       // talkBox.insertBefore(aiTalk, userTalk.nextSibling);
//       robotCon.appendChild(headRobot);
//       robotCon.appendChild(aiTalk);
//       talkBox.appendChild(robotCon);
//       scrollBox.scrollTop = scrollBox.scrollHeight;
//     }, 800);
//   }
//
// }
