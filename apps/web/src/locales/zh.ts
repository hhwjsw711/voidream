export default {
  header: {
    pricing: "定价",
    signIn: "登录",
  },
  hero: {
    title: "每个想法都是一部大片",
    description: "输入想法，即刻成片，按次付费，简单实惠",
  },
  getStarted: {
    heading: "开始使用",
    title: "把想法变成视频",
    description: "输入想法，AI 帮你生成视频。",
    button: {
      startAutomating: "立即体验",
      readDocumentation: "查看定价",
    },
  },
  companies: {
    title: "用户案例",
    addYourCompany: "更多机构持续加入中...",
  },
  features: {
    title: "核心功能",
    aiScript: "AI剧本创作",
    aiScriptDescription: "一键生成专业视频剧本，让创意更高效。",
    aiVoice: "智能配音",
    aiVoiceDescription: "多种专业音色，自动匹配角色，打造自然语音。",
    aiVideo: "智能视频生成",
    aiVideoDescription: "将文字自动转化为精美视频，省时又专业。",
    aiSubtitle: "智能字幕",
    aiSubtitleDescription: "自动生成多语言字幕，完美同步音画。",
    aiTemplate: "场景模板",
    aiTemplateDescription: "丰富的场景模板库，一键套用快速出片。",
    aiStyle: "风格定制",
    aiStyleDescription: "多种视觉风格可选，打造独特品牌形象。",
    easyShare: "便捷分享",
    easyShareDescription: "支持多平台一键分享，扩大内容影响力。",
    fastRender: "快速渲染",
    fastRenderDescription: "高效云端渲染，让创意快速变成作品。",
  },
  login: {
    title: "登录",
    github: "使用GitHub登录",
    google: "使用Google登录",
    footer: "自动化您的本地化。",
    description: "登录以在几秒钟内开始自动化您的本地化。",
    terms: {
      text: "通过登录，您同意我们的",
      termsOfService: "服务条款",
      and: "和",
      privacyPolicy: "隐私政策",
    },
  },
  pricing: {
    title: "灵活定价",
    basic: {
      title: "基础套餐",
      price: "¥98",
      points: "100积分",
      description: "适合轻度使用",
      features: {
        video_quality: "生成720P视频",
        basic_voice: "基础AI配音",
        basic_template: "基础场景模板",
        with_watermark: "带水印导出",
        subtitle: "单语种字幕",
        basic_bgm: "基础背景音乐",
      },
    },
    pro: {
      title: "超值套餐",
      features: {
        point_usage: "积分可用于以下全部功能：",
        video_quality: "生成1080P高清视频",
        all_voice: "全部AI配音音色",
        all_template: "全部场景模板",
        no_watermark: "无水印导出",
        multi_subtitle: "多语种字幕",
        pro_bgm: "专业音乐音效库",
      },
    },
    cta: "立即购买",
    points_never_expire:
      "积分永不过期，可随时使用。购买更多积分享受更多优惠。支持对公转账，可开具发票。",
    points_usage_explanation:
      "1积分可用于生成5秒视频。视频质量、是否带水印、字幕语言数量等会影响具体积分消耗。详细定价请查看具体功能页面。",
  },
  language: {
    en: "英语",
    es: "西班牙语",
    fr: "法语",
    de: "德语",
    it: "意大利语",
    pt: "葡萄牙语",
    zh: "中文",
    ja: "日语",
    ko: "韩语",
    ar: "阿拉伯语",
    hi: "印地语",
    tr: "土耳其语",
    nl: "荷兰语",
    pl: "波兰语",
    no: "挪威语",
    da: "丹麦语",
    sv: "瑞典语",
    fi: "芬兰语",
    vi: "越南语",
  },
  faq: {
    title: "常见问题",
    processing_time: {
      question: "视频生成需要多长时间？",
      answer:
        "视频生成时间取决于内容长度和复杂度。一般5秒的视频片段生成需要1-2分钟，包括AI文案、配音、画面生成和合成的全过程。系统会自动将多个片段合并，您可以在生成过程中预览每个片段。",
    },
    ai_features: {
      question: "支持哪些AI功能？",
      answer:
        "我们提供AI文本生成、AI配音（支持多种音色）、AI场景生成、智能字幕等功能。所有功能都可以用积分兑换使用，不同功能消耗的积分数量不同。您可以在生成前查看具体的积分消耗。",
    },
    edit_after_generation: {
      question: "生成后的视频可以编辑吗？",
      answer:
        "生成的视频支持基础编辑功能，包括修改字幕、调整背景音乐、裁剪时长等。每次重新生成都会消耗相应积分，编辑已生成的视频不额外消耗积分。",
    },
    batch_generation: {
      question: "支持批量生成视频吗？",
      answer:
        "支持批量生成，您可以提前准备好文案列表。建议先用少量积分测试效果，确认满意后再进行批量生成。企业用户可以通过API实现更高效的批量处理。",
    },
    points_expire: {
      question: "积分会过期吗？",
      answer:
        "不会。您购买的积分永不过期，可以一直保留在账户中。我们还会不定期推出优惠活动，购买更多积分可以获得额外赠送。",
    },
    points_transfer: {
      question: "积分可以转让或退款吗？",
      answer:
        "积分不支持转让或退款。购买前请确认您的需求，积分一旦购买即视为确认使用我们的服务。企业用户可以通过团队账号实现积分共享。",
    },
    quality_guarantee: {
      question: "如果生成效果不理想怎么办？",
      answer:
        "AI生成是一个迭代的过程，您可以：1) 调整提示词重新生成；2) 更换场景模板重试；3) 使用编辑功能微调。每次生成都会消耗相应积分，建议在小规模测试满意后再进行批量生成。如遇到技术问题，可以联系客服获取帮助。",
    },
    commercial_use: {
      question: "可以用于商业用途吗？",
      answer:
        "可以。我们的服务支持商业使用，生成的内容您拥有完整的使用权。对于大量商业需求，建议选择更优惠的批量积分包或联系我们获取企业定制方案。",
    },
    content_safety: {
      question: "对生成内容有什么限制？",
      answer:
        "我们禁止生成任何违法、暴力、色情等违规内容。如发现违规使用，将直接关闭账号且不予退还积分。建议您在使用前仔细阅读我们的服务条款和内容规范。",
    },
    api_access: {
      question: "是否提供API接口？",
      answer:
        "是的，我们提供完整的API接口，支持视频生成的全流程自动化。企业用户可以获得专属的API支持和更高的并发限制。如需了解详情，请联系商务团队。",
    },
    payment_methods: {
      question: "支持哪些支付方式？",
      answer:
        "目前支持支付宝、微信支付等主流支付方式。支付成功后积分会立即到账。企业用户如需对公转账或开具发票，请联系客服处理。",
    },
  },
  pricing_slider: {
    tier: "套餐 {tier}",
    points: "基础积分",
    bonus: "赠送积分",
    period: "永久",
    points_suffix: "积分",
    bonus_suffix: "赠送",
    total: "总积分",
    price_per_point: "单价",
  },
} as const;
