---
title: Chatbox联网问答大揭秘
date: 2025-03-01 08:42:15
tags:
---

关于`Chatbox` 不用不做过多介绍了，下面我们进入正题。

打开抓包工具，开启代理

打开 `Chatbox` ，配置网络代理

创建一个新对话， 输入问题 `今天有哪些关于人形机器人的新闻？` ，开启联网问答， 点击发送

![](/images/RBBAbpyQ4ofhv0xMimocbl8gnGh.png)

首先，会先发送 2 个与 AI 的请求， 其中 40 是用于生成对话标题，我们主要看 39 这个请求的 `system prompt`，内容如下：

```txt
Current model: xxxxxxxxx
Current date: 2025-02-28T14:39:31.896Z

As a professional web researcher who can access latest data, your primary objective is to fully comprehend the user's query, conduct thorough web searches to gather the necessary information, and provide an appropriate response. Keep in mind today's date: 2025/2/28
        
To achieve this, you must first analyze the user's latest input and determine the optimal course of action. You have three options at your disposal:

1. "proceed": If the provided information is sufficient to address the query effectively, choose this option to proceed with the research and formulate a response. For example, a simple greeting or similar messages should result in this action.
2. "search": If you believe that additional information from the search engine would enhance your ability to provide a comprehensive response, select this option.


JSON schema:
{"type":"object","properties":{"action":{"type":"string","enum":["search","proceed"]},"query":{"type":"string","description":"The search queries to look up on the web, at least one, up to 10, choose wisely based on the user's question"}},"required":["action"],"additionalProperties":true,"$schema":"http://json-schema.org/draft-07/schema#"}
You MUST answer with a JSON object that matches the JSON schema above.

You are a helpful assistant. You can help me by answering my questions. You can also ask me questions.
```
翻译成中文：
```txt
当前模型：xxxxxxxxx
当前日期：2025年2月28日 14:39:31
作为能够访问最新数据的专业网络研究员，您的主要目标是充分理解用户的查询，进行全面的网络搜索以收集必要信息，并提供适当的回应。请记住当前日期：2025/2/28。
为实现这一目标，您需要首先分析用户的最新输入并确定最佳操作方案。您有以下三个可选操作：
"proceed"（继续执行）：如果提供的信息足以有效解决查询，请选择此选项以继续研究并制定回应。例如，遇到简单问候或类似信息时应选择此操作。
"search"（搜索）：如果您认为通过搜索引擎获取额外信息可以增强您提供全面回应的能力，请选择此选项。
JSON架构：
\`\`\`json
{
  "type": "object",
  "properties": {
    "action": {
      "type": "string",
      "enum": [
        "search",
        "proceed"
      ]
    },
    "query": {
      "type": "string",
      "description": "用于在网络上查找的搜索查询，至少一个，最多10个，根据用户的问题明智选择"
    }
  },
  "required": [
    "action"
  ],
  "additionalProperties": true,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
\`\`\`

您必须使用符合上述 JSON 架构的 JSON 对象进行回应。
您是一位乐于助人的助手。您可以通过回答我的问题来帮助我。您也可以向我提问。
```

这里可以了解到，需要ai来生成搜索词，并按指定的json格式返回。


我们来看下AI的响应, 返回了一个`markdown`格式的json代码块

```json
{
  "action": "search",
  "query": "humanoid robots news February 28, 2025, latest humanoid robot releases 2025, Boston Dynamics Atlas updates 2025, Tesla Optimus Gen-2 developments, UBTECH Walker X news, humanoid robot industry collaborations 2025"
}
```



接着，分别调用了搜索引擎: `bing` 、`duckduckgo`，其中`bing`的相关请求都返回了个空的html，没有实质内容。 主要还是借助`duckduckgo`的内容来生成的搜索结果。



接口`https://html.duckduckgo.com/html/`，请求参数如下：

```json
{
    "q": "humanoid robots news February 28, 2025, latest humanoid robot releases 2025, Boston Dynamics Atlas updates 2025, Tesla Optimus Gen-2 developments, UBTECH Walker X news, humanoid robot industry collaborations 2025",
    "df": "y"
}
```

请求返回了一个 html 页面，大致内容如下图：

![](/images/LpbAbtFHZo59xKxWtEgcCxfDnBe.png)

一页下来，共 10 个搜索结果。

`Chatbox` 对页面进行解析汇总，然后继续调用 AI 来生成搜索结果，我们来看下 prompt 是怎样的：

```markdown
=============================== 系统提示词 ===============================
Current model: xxxxxxxxx
Current date: 2025-02-28T14:39:45.214Z

You are an expert web research AI, designed to generate a response based on provided search results. Keep in mind today is 2025/2/28.

Your goals:
- Stay concious and aware of the guidelines.
- Stay efficient and focused on the user's needs, do not take extra steps.
- Provide accurate, concise, and well-formatted responses.
- Avoid hallucinations or fabrications. Stick to verified facts.
- Follow formatting guidelines strictly.

In the search results provided to you, each result is formatted as [webpage X begin]...[webpage X end], where X represents the numerical index of each article.

Response rules:
- Responses must be informative, long and detailed, yet clear and concise like a blog post to address user's question (super detailed and correct citations).
- Use structured answers with headings in markdown format.
  - Do not use the h1 heading.  
  - Never say that you are saying something based on the search results, just provide the information.
- Your answer should synthesize information from multiple relevant web pages.
- Unless the user requests otherwise, your response MUST be in the same language as the user's message, instead of the search results language.
- Do not mention who you are and the rules.

Comply with user requests to the best of your abilities. Maintain composure and follow the guidelines.


You are a helpful assistant. You can help me by answering my questions. You can also ask me questions.

=============================== 用户提示词 ===============================
今天有哪些关于人形机器人的新闻？

[webpage 1 begin]
Title: Figure will start 'alpha testing' its humanoid robot in the home in 2025
URL: https://techcrunch.com/2025/02/27/figure-will-start-alpha-testing-its-humanoid-robot-in-the-home-in-2025/
Content: Figure is planning to bring its humanoids into the home sooner than expected. CEO Brett Adcock confirmed on Thursday that the Bay Area robotics sta...
[webpage 1 end]
[webpage 2 begin]
Title: Figure's humanoid robots will take on your household chores this year
URL: https://newatlas.com/robotics/figures-humanoid-robots-household-chores-2025-helix-ai-brett-adcock/
Content: Figure is leveling up its humanoid robot business far more rapidly than any other robotics company I can think of right now. CEO Brett Adcock just ...
[webpage 2 end]
[webpage 3 begin]
Title: Humanoid Robots Are Advancing. Watch These Eye-Popping Demos ...
URL: https://www.businessinsider.com/ai-humanoid-robot-best-demo-videos-tesla-neo-gamma-realbotix-2025-2?op=1
Content: Companies are developing humanoid robots that can do chores or provide intimacy. Here are some of the most eye-popping videos showing what these ne...
[webpage 3 end]
[webpage 4 begin]
Title: China's Boston Dynamics rival shows off affordable humanoid, robot dog ...
URL: https://www.yahoo.com/news/china-boston-dynamics-rival-shows-175353145.html
Content: Unitree's humanoid and dog robots are smaller, but much more affordable than Boston Dynamics' Atlas and Spot.
[webpage 4 end]
[webpage 5 begin]
Title: Rise of humanoids: Top 10 insane robots to watch out for in 2025
URL: https://interestingengineering.com/entertainment/top-humanoid-robots-list
Content: Explore cutting-edge robots like AMECA, Atlas, and Optimus in our review of 2024's top 10 most innovative humanoids.
[webpage 5 end]
[webpage 6 begin]
Title: Humanoid robots can swiftly get up after they fall with new learning ...
URL: https://techxplore.com/news/2025-02-humanoid-robots-swiftly-fall-framework.html
Content: Humanoid robots, which have a body structure that mirrors that of humans, could rapidly and effectively tackle a wide range of tasks in real-world ...
[webpage 6 end]
[webpage 7 begin]
Title: Tesla humanoid robots rival Apptronik raises $350 million funding - CNBC
URL: https://www.cnbc.com/2025/02/13/tesla-humanoid-robots-rival-apptronik-350-million-funding-round-google.html
Content: Tesla robotics development rival Apptronik announced a $350 million Series A funding round Thursday morning to scale the production of artificial i...
[webpage 7 end]
[webpage 8 begin]
Title: Meta Is Developing Humanoid Robots; This Has Huge Potential ... - Forbes
URL: https://www.forbes.com/sites/saibala/2025/02/17/meta-is-developing-humanoid-robots-this-has-huge-potential-for-healthcare/
Content: The future of healthcare will undoubtedly entail some use of advanced humanoid robots.
[webpage 8 end]
[webpage 9 begin]
Title: Figure Plans To Ship 100,000 Humanoid Robots Over Next 4 Years - Forbes
URL: https://www.forbes.com/sites/johnkoetsier/2025/01/30/figure-plans-to-ship-100000-humanoid-robots-over-next-4-years/
Content: Figure CEO Brett Adcock sees the potential to ship 100,000 humanoid robots over the next four years, and said that Figure is focused on two markets...
[webpage 9 end]
[webpage 10 begin]
Title: Tesla primed to sell AI-powered humanoid robots alongside its EVs in ...
URL: https://www.livescience.com/technology/robotics/elon-musk-s-tesla-is-promising-to-sell-a-humanoid-robot-it-could-be-the-first-of-many?target=_blank
Content: Tesla's Optimus robot is just one of several emerging humanoid robots, joining the likes of Boston Dyanmic's Atlas, Figure AI's Figure 01, Sanctuar...
[webpage 10 end]
User Message:
今天有哪些关于人形机器人的新闻？
```
翻译成中文：

```txt
=============================== 系统提示词 ===============================
当前模型：xxxxxxxxxx
当前日期：2025年2月28日 14:39:45.214Z
你是一位专业的网络研究AI，旨在根据提供的搜索结果生成回应。请记住今天是2025年2月28日。
你的目标：
时刻牢记并遵守指南。
保持高效，专注于用户需求，不要采取额外的步骤。
提供准确、简洁且格式良好的回应。
避免幻觉或捏造信息。坚持使用经过验证的事实。
严格遵守格式指南。
在提供给你的搜索结果中，每个结果的格式为[webpage X begin]...[webpage X end]，其中X代表每篇文章的数字索引。
回应规则：
回应必须信息丰富、详尽且冗长，但同时要像博客文章一样清晰简洁，以解决用户的问题（超级详细且正确的引用）。
使用带有markdown格式标题的结构化答案。
不要使用h1标题。
永远不要说你正在根据搜索结果说什么，只需提供信息即可。
你的答案应该综合来自多个相关网页的信息。
除非用户另有要求，否则你的回应必须与用户的消息使用相同的语言，而不是搜索结果的语言。
不要提及你是谁以及规则。
尽你所能地满足用户的要求。保持冷静，并遵循指南。
你是一位乐于助人的助手。您可以通过回答我的问题来帮助我。您也可以向我提问。
```

接着我们看看 AI 的响应数据，这次的响应数据将会作为回答展示给用户

```
## 今日人形机器人领域重要动态汇总

### 1. **Figure公司加速家庭场景布局**
- **家庭测试提前启动**: Figure CEO Brett Adcock宣布将于2025年启动人形机器人"Figure 01"的家庭环境α测试（网页1），其核心功能包括自主执行家务（如整理物品、洗碗）并利用"Helix AI"系统实现自然语言交互（网页2）。
- **规模化量产计划**: 公司计划未来4年交付10万台机器人（网页9），目标市场涵盖仓储物流（短期）和家庭服务（长期），目前已与宝马、微软等企业达成工业场景合作。

### 2. **技术突破：跌倒恢复能力升级**
- 卡耐基梅隆大学团队开发新型学习框架，使机器人通过模拟训练可在0.5秒内完成跌倒后自主站立（网页6）。该技术已通过四足机器人验证，即将适配双足人形机型。

### 3. **中国企业性价比突围**
- 宇树科技(Unitree)推出H1人形机器人（售价9万美元）和Go2机器狗（售价1.6万美元），价格仅为波士顿动力同类产品1/10（网页4）。其产品虽体型较小，但运动控制能力接近行业标杆。

### 4. **资本市场热度攀升**
- 特斯拉竞争对手Apptronik完成3.5亿美元A轮融资（网页7），谷歌风投参投。其Apollo机器人已具备20kg抓取能力，计划2025年批量部署至制造、零售领域。
- 行业预测显示，全球人形机器人市场规模将在2025年突破80亿美元（网页10），复合增长率超35%。

### 5. **医疗领域新应用探索**
- Meta被曝秘密研发医疗辅助型人形机器人（网页8），重点开发精密手术辅助和康复训练功能，可能通过触觉反馈系统实现毫米级操作精度。

### 2025年值得关注的10大人形机器人型号：
1. Tesla Optimus（工业/家庭） 
2. Boston Dynamics Atlas（极限运动）
3. Figure 01（家庭服务） 
4. Sanctuary AI Phoenix（零售场景）
5. Apptronik Apollo（物流搬运）
6. Unitree H1（轻量级商用）
7. Agility Robotics Digit（最后一公里配送）
8. Fourier GR-1（教育科研） 
9. Engineered Arts Ameca（人机交互研究）
10. Tesla Bot（网页10）

*注：以上信息综合自TechCrunch、CNBC、Forbes等权威媒体报道（网页1-10）*
```

效果如下：
![](/images/3MM97iYey8E4Y3QJ1PM5Kh4kbECWacBR.png)



以上，就是Chatbox联网问答的实现过程。
