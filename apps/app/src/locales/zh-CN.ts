export default {
  language: {
    en: "英语",
    es: "西班牙语",
    fr: "法语",
    de: "德语",
    it: "意大利语",
    pt: "葡萄牙语",
    ja: "日语",
    ko: "韩语",
    ar: "阿拉伯语",
    tr: "土耳其语",
    nl: "荷兰语",
    pl: "波兰语",
    no: "挪威语",
    da: "丹麦语",
    sv: "瑞典语",
    fi: "芬兰语",
    vi: "越南语",
    az: "阿塞拜疆语",
    bg: "保加利亚语",
    ca: "加泰罗尼亚语",
    cs: "捷克语",
    el: "希腊语",
    et: "爱沙尼亚语",
    he: "希伯来语",
    hr: "克罗地亚语",
    hu: "匈牙利语",
    id: "印度尼西亚语",
    iw: "希伯来语",
    km: "柬埔寨语",
    lv: "拉脱维亚语",
    "pt-BR": "巴西葡萄牙语",
    ro: "罗马尼亚语",
    ru: "俄语",
    "sk-SK": "斯洛伐克语",
    sk: "斯洛伐克语",
    sr: "塞尔维亚语",
    ta: "泰米尔语",
    th: "泰语",
    uk: "乌克兰语",
    "zh-CN": "简体中文",
    "zh-TW": "繁体中文",
  },
  login: {
    title: "登录",
    github: "使用GitHub登录",
    google: "使用Google登录",
    footer: "让AI为您创作精彩视频",
    description: "登录即可开始AI视频创作",
    terms: {
      text: "通过登录，您同意我们的",
      termsOfService: "服务条款",
      and: "和",
      privacyPolicy: "隐私政策",
    },
  },
  navigation: {
    dashboard: "控制台",
    settings: "设置",
    billing: "付费",
    logOut: "退出登录",
    theme: "外观",
    language: "语言",
  },
  theme: {
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
  },
  carousel: {
    button: "快速生成",
  },
  dashboard: {
    features: {
      quickGen: "快速创作",
      batchGen: "批量创作",
      content: "素材库",
      image: "生成图片",
      video: "生成视频",
      audio: "配音制作",
    },
  },
  generate: {
    title: "创建视频",
    steps: {
      step1: "选择模式",
      step2: "编写提示",
      step3: "自定义",
    },
    mode: {
      script: "脚本模式",
      segment: "分段模式",
      guided: "引导模式",
    },
    guided: {
      title: "引导创作模式",
      steps: {
        step1: "选择模式",
        step2: "编写提示",
        step3: "优化调整",
        step4: "自定义",
      },
      form: {
        title: "输入提示",
        description: "故事描述",
        titleLabel: "标题",
        titleNote: "(将用于模板)",
        titlePlaceholder: "掌握社交媒体算法：成功的关键 📱",
        descriptionLabel: "故事描述",
        descriptionPlaceholder: `生成一个130字以内的视频脚本，分为五个简短段落。

包含一个吸引人的开场白，一个清晰的主要观点，以及给观众的实用建议。

脚本主题应该匹配标题：掌握社交媒体算法：成功的关键 📱`,
        buttons: {
          ytShort: "短视频 (60秒)",
          generate: "生成引导故事",
          generating: "生成中...",
        },
        credits: "积分",
        toast: {
          success: {
            title: "故事已创建",
            description: "您的引导故事正在生成中。稍后您可以进行优化。",
          },
          error: {
            title: "创建引导故事失败",
            description: "请重试。",
          },
        },
        validation: {
          titleRequired: "标题是必填项",
          descriptionLength: "描述至少需要50个字符",
        },
      },
    },
    script: {
      title: "脚本创作模式",
      steps: {
        step1: "选择模式",
        step2: "编写脚本",
        step3: "自定义",
      },
      form: {
        enterScript: "输入您的脚本",
        title: "标题",
        titlePlaceholder: "输入故事标题",
        script: "脚本",
        scriptPlaceholder: "在此编写脚本...",
        characters: "字符",
        estimatedLength: "预计视频时长：",
        seconds: "秒",
        customContext: {
          title: "使用自定义图片上下文",
          description: "切换以提供自定义图片提示上下文",
          label: "自定义图片上下文",
          placeholder: "输入自定义图片提示上下文...",
          note: "如果留空，我们将使用AI自动生成的上下文。",
          premadeContexts: "预设上下文",
        },
        videoFormat: {
          title: "视频格式",
          vertical: "竖屏",
          horizontal: "横屏",
        },
        creditEstimate: {
          title: "预计积分使用：",
          item: "项目",
          credits: "积分",
          imageGeneration: "图片生成",
          textTokens: "文本处理",
          total: "总计",
        },
        generate: "生成图片并预览",
        generating: "生成中...",
        credits: "积分",
        errors: {
          validation: "验证失败",
          checkFields: "请检查输入字段",
          creditCheckFailed: "积分检查失败",
          tryAgain: "请稍后重试",
          insufficientCredits: "积分不足",
          insufficientCreditsDesc: "您的积分不足以完成此操作",
          generateFailed: "生成失败",
        },
        success: {
          title: "生成成功",
          description: "脚本已生成",
        },
      },
      contexts: {
        labels: {
          photoRealistic: "照片级真实",
          scary: "恐怖",
          fantasy: "奇幻",
          scifi: "科幻",
          nature: "自然",
          urban: "城市",
          historical: "历史",
          underwater: "水下",
          steampunk: "蒸汽朋克",
          cyberpunk: "赛博朋克",
          fairytale: "童话",
          postApocalyptic: "后启示录",
          space: "太空",
        },
        descriptions: {
          photoRealistic: "高质量、逼真的图像，细节清晰，色彩鲜艳，自然光照",
          scary:
            "黑暗阴森的氛围，阴影人物，不祥的光线，雾气，废弃场所，恐怖元素",
          fantasy: "魔幻景观，神话生物，魔法森林，空中城堡，发光的神器",
          scifi: "未来都市景观，高科技，外星世界，空间站，全息界面",
          nature: "茂密森林，宁静湖泊，雄伟山脉，生机勃勃的野生动物，壮丽景观",
          urban: "繁忙的城市街道，摩天大楼，霓虹灯，多元化人群，城市建筑",
          historical: "古代文明，历史准确的服装，历史地标，复古美学",
          underwater:
            "色彩斑斓的珊瑚礁，奇异海洋生物，沉船，生物发光体，深海海沟",
          steampunk:
            "维多利亚时代科技，黄铜和铜制机械，飞艇，发条装置，蒸汽动力发明",
          cyberpunk:
            "霓虹街道，机械植入体，虚拟现实，反乌托邦大都市，高科技低生活",
          fairytale: "奇幻小屋，会说话的动物，魔法物品，魔法森林，童话美学",
          postApocalyptic:
            "废墟城市，过度生长的植被，生存装备，临时定居点，荒凉景观",
          space:
            "遥远星系，绚丽星云，外星行星，未来宇宙飞船，探索新世界的宇航员",
        },
      },
    },
    segment: {
      title: "分段创作模式",
      description: {
        vertical: "竖屏视频适合抖音和 Instagram Reels 等平台。",
        horizontal: "横屏视频更适合 YouTube 和传统视频播放器。",
        note: "注意：一旦设置，如果不重新生成所有图片，方向将无法更改，请谨慎选择！",
      },
      steps: {
        step1: "选择模式",
        step2: "基础设置",
        step3: "自定义",
      },
      buttons: {
        vertical: "竖屏",
        horizontal: "横屏",
        cancel: "取消",
        generate: "生成",
        generating: "生成中...",
        generateSegments: "生成分段",
      },
      form: {
        selectFormat: "选择视频格式",
        vertical: "竖屏模式",
        horizontal: "横屏模式",
        verticalRatio: "适用于手机 (9:16)",
        horizontalRatio: "适用于电脑 (16:9)",
        startWriting: "开始分段创作",
        success: {
          title: "创建成功",
          description: "已创建新故事，请开始编写",
        },
        error: {
          title: "创建失败",
          unknown: "创建故事时发生错误",
        },
        creating: "创建中...",
      },
      defaultTitle: "未命名故事",
    },
    refine: {
      title: "智能优化创作",
      description: "输入优化指令。这将消耗 1 个积分。",
      instructions: {
        label: "优化指令",
        placeholder: "输入优化指令...",
      },
      buttons: {
        cancel: "取消",
        refine: "优化 (1积分)",
        refineStory: "优化故事",
      },
      toast: {
        start: {
          title: "开始优化故事",
          description: "正在根据您的指令优化故事内容，请稍候...",
        },
        error: {
          title: "优化失败",
          description: "请稍后重试",
        },
      },
      steps: {
        step1: "选择模式",
        step2: "编写提示",
        step3: "优化调整",
        step4: "自定义",
      },
    },
    status: {
      unsaved: "未保存的更改",
      processing: "处理中...",
      loading: "加载故事中...",
      stats: {
        words: "字",
        characters: "字符",
        estimatedLength: "预计视频长度：",
      },
    },
    creditEstimate: {
      title: "积分使用预估",
      item: "项目",
      credits: "积分",
      imageGeneration: "图片生成",
      textTokens: "文本处理",
      total: "总计",
    },
  },
  story: {
    overview: {
      title: "自定义您的故事",
      backToStories: "返回故事列表",
      loading: "加载故事中...",
      notFound: "未找到故事",
      steps: {
        step1: "选择模式",
        step2: "编写提示",
        step3: "优化调整",
        step4: "自定义",
      },
      storyTitle: {
        placeholder: "请输入标题",
        edit: "编辑标题",
        saving: "保存中...",
        toast: {
          success: {
            title: "标题已更新",
            description: "故事标题已成功更新",
          },
          error: {
            title: "更新失败",
            description: "标题更新失败，请重试",
          },
        },
      },
    },
    actions: {
      review: {
        label: "故事审查",
        dialog: {
          title: "故事审查",
          description: "使用 AI 审查您的故事并获取反馈",
          loading: {
            analyzing: {
              title: "正在分析您的故事",
              description: "AI 审查员正在仔细评估您的故事...",
            },
            applying: {
              title: "正在应用修改",
              description: "AI 正在根据审查结果改进您的故事...",
            },
            wait: "这可能需要一分钟",
          },
          empty: {
            title: "暂无审查",
            description: "点击“生成审查”按钮获取反馈",
          },
          buttons: {
            close: "关闭",
            generate: {
              label: "生成审查",
              credits: "积分",
            },
            apply: {
              label: "应用修改",
              credits: "积分",
            },
          },
          toast: {
            generate: {
              error: {
                title: "生成失败",
                description: "请重试",
              },
            },
            apply: {
              start: {
                title: "正在应用修改",
                description: "AI 正在根据审查结果改进您的故事...",
              },
              error: {
                title: "应用修改失败",
                description: "请重试",
              },
              success: {
                title: "修改已应用",
                description: "您的故事已成功更新",
              },
            },
            process: {
              error: {
                title: "错误",
                description: "故事处理失败",
              },
            },
          },
        },
      },
      grammar: {
        label: "快速语法检查",
        dialog: {
          title: "快速语法检查",
          description: "自动修正所有段落中的基本拼写和语法错误。",
          content: {
            intro: "此快速修正将：",
            items: {
              spelling: "修正拼写错误",
              grammar: "修正基本语法错误",
              punctuation: "修正标点符号问题",
            },
            note: "注意：如需更全面的改进，请使用“故事审查”功能。",
            credits: "此操作需要 2 积分。",
          },
          buttons: {
            cancel: "取消",
            fix: {
              default: "快速修正",
              processing: "处理中...",
              starting: "开始中...",
              credits: "积分",
            },
          },
          toast: {
            success: {
              description: "语法和拼写已修正",
            },
            error: {
              process: {
                description: "语法和拼写修正失败",
              },
              start: {
                description: "启动语法检查失败",
              },
            },
          },
        },
      },
      read: {
        label: "阅读全文",
        dialog: {
          buttons: {
            copy: {
              default: "复制到剪贴板",
              copied: "已复制！",
            },
            close: "关闭",
          },
          toast: {
            copy: {
              success: {
                description: "内容已复制到剪贴板",
              },
              error: {
                description: "复制内容失败",
              },
            },
          },
        },
      },
      clone: {
        label: {
          toHorizontal: "转为横版",
          toVertical: "转为竖版",
        },
        dialog: {
          title: "复制故事",
          description: {
            toHorizontal: "创建新的横版故事，保留所有内容。",
            toVertical: "创建新的竖版故事，保留所有内容。",
          },
          content: {
            intro: "此操作将：",
            items: {
              ratio: {
                toHorizontal: "创建新的 16:9 横版故事",
                toVertical: "创建新的 9:16 竖版故事",
              },
              text: "复制所有文本内容",
              images: {
                toHorizontal: "生成针对横版布局优化的新图片",
                toVertical: "生成针对竖版布局优化的新图片",
              },
            },
            credits: {
              required: "所需积分", // 移除 {amount}
              available: "当前积分", // 移除 {amount}
              insufficient: {
                notice: "积分不足。",
                detail: "还需要 {amount} 积分。",
              },
            },
          },
          buttons: {
            cancel: "取消",
            clone: {
              default: {
                toHorizontal: "转为横版",
                toVertical: "转为竖版",
              },
              creating: "正在创建...",
              insufficient: "积分不足",
            },
          },
          toast: {
            success: {
              description: "故事已成功复制！正在跳转到新故事...",
            },
            error: {
              credits: {
                description: "积分不足",
              },
              clone: {
                description: "复制故事失败",
              },
            },
          },
        },
      },
      video: {
        label: "生成视频",
        dialog: {
          title: "生成视频",
          voice: {
            label: "选择语音",
            preview: {
              play: "播放预览",
              pause: "暂停预览",
            },
          },
          options: {
            watermark: {
              label: "添加水印以获得 80% 折扣",
            },
            public: {
              label: "设为公开视频",
            },
            spacing: {
              label: "使用宽松间距",
            },
            captions: {
              label: "显示字幕",
              position: {
                label: "字幕位置",
                options: {
                  top: "顶部",
                  "mid upper": "中上",
                  "mid lower": "中下",
                  bottom: "底部",
                },
              },
              highlight: {
                label: "高亮颜色",
                options: {
                  yellow: "黄色",
                  blue: "蓝色",
                  red: "红色",
                  green: "绿色",
                },
              },
            },
          },
          buttons: {
            cancel: "取消",
            generate: {
              default: "生成",
              generating: "生成中...",
              credits: "积分",
            },
          },
          toast: {
            error: {
              title: "生成失败",
              description: "请稍后重试。",
            },
          },
        },
      },
    },
    orientation: {
      vertical: "竖屏",
      horizontal: "横屏",
    },
    imageContext: {
      button: "编辑图片上下文",
      dialog: {
        title: "编辑图片生成上下文",
        description: "修改用于生成图片的上下文描述",
        label: "上下文",
        placeholder: "输入图片生成的上下文描述...",
        help: "上下文包括关键场景、主要角色、整体氛围、视觉元素和故事的情感基调。",
        buttons: {
          cancel: "取消",
          save: "保存更改",
          saving: "保存中...",
        },
      },
      toast: {
        success: {
          title: "成功",
          description: "图片上下文更新成功",
        },
        error: {
          title: "错误",
          description: "更新上下文失败，请重试",
        },
      },
    },
    videoGeneration: {
      dialog: {
        title: "生成视频",
        watermark: {
          label: "包含水印以获得80%折扣",
        },
        public: {
          label: "设为公开视频",
        },
        laxSpacing: {
          label: "使用宽松间距",
        },
        captions: {
          label: "包含字幕",
          position: {
            label: "字幕位置",
            top: "顶部",
            midUpper: "中上",
            midLower: "中下",
            bottom: "底部",
          },
          highlight: {
            label: "高亮颜色",
            yellow: "黄色",
            blue: "蓝色",
            red: "红色",
            green: "绿色",
          },
        },
        voice: {
          label: "选择语音",
          placeholder: "选择语音",
        },
        buttons: {
          cancel: "取消",
          generate: "生成",
          generating: "生成中...",
        },
        credits: "积分",
      },
    },
    prompt: {
      dialog: {
        title: "修改提示词",
        description: "修改用于生成分段图片的提示词。",
        label: "提示词",
        placeholder: "描述你想要生成的图片内容和风格",
        saving: "保存中...",
        regenerate: "重新生成",
        regenerating: "重新生成中...",
        cancel: "取消",
        credits: "积分",
      },
      toast: {
        success: {
          title: "成功",
          description: "正在重新生成图片",
        },
        error: {
          title: "错误",
          description: "重新生成图片失败",
          saveFailed: "提示词保存失败，请重试",
        },
      },
    },
    segment: {
      card: {
        title: "段落 {order}",
        generating: "AI 正在生成...",
        placeholder: "输入段落内容...",
        saving: "保存中...",
        wordCount: "{count} / 750",
        aspectRatio: {
          vertical: "9:16",
          horizontal: "16:9",
        },
        image: {
          alt: "段落 {order} 图片",
          generate: {
            button: "生成图片",
            disabled: "请先输入内容",
            toast: {
              start: {
                title: "开始生成",
                description: "AI 正在为您生成图片",
              },
              error: {
                title: "错误",
                description: "生成图片失败",
              },
            },
          },
        },
        text: {
          maxLength: "内容不能超过750个字符",
          toast: {
            error: {
              title: "错误",
              description: "保存失败，请重试",
            },
          },
        },
      },
      imageGeneration: {
        button: {
          generating: "正在生成图片...",
          generate: "生成图片 (10积分)",
          disabled: "请先输入内容",
        },
      },
      menu: {
        trigger: {
          label: "段落选项",
        },
        items: {
          refineText: {
            label: "优化文本",
            toast: {
              success: {
                title: "成功",
                description: "文本优化成功",
              },
              error: {
                title: "错误",
                description: "文本优化失败",
              },
            },
          },
          regenerateImage: {
            label: "重新生成图片 (10积分)",
            toast: {
              success: {
                title: "成功",
                description: "已发送重新生成请求",
              },
              error: {
                title: "错误",
                description: "重新生成失败",
              },
            },
          },
          changePrompt: {
            label: "修改图片提示词",
            dialog: {
              title: "修改提示词",
              description: "修改用于生成段落图片的提示词。",
            },
          },
          delete: {
            label: "删除段落",
            toast: {
              success: {
                title: "成功",
                description: "段落已删除",
              },
              error: {
                title: "错误",
                description: "删除失败",
              },
            },
          },
        },
      },
      promptForm: {
        label: "提示词",
        description: "描述你想要生成的图片内容和风格",
        saving: "保存中...",
        buttons: {
          cancel: "取消",
          regenerate: {
            default: "重新生成",
            pending: "重新生成中...",
            credits: "积分",
          },
        },
        toast: {
          regenerate: {
            success: {
              title: "成功",
              description: "正在重新生成图片",
            },
            error: {
              title: "错误",
              description: "重新生成图片失败",
            },
          },
          save: {
            error: {
              title: "错误",
              description: "提示词保存失败，请重试",
            },
          },
        },
      },
      addButton: {
        label: "添加新段落",
        toast: {
          success: {
            title: "成功",
            description: "已添加新段落，请输入内容",
          },
          error: {
            title: "错误",
            description: "添加段落失败",
          },
        },
      },
    },
    review: {
      dialog: {
        title: "故事评审",
        description: "AI 将评审你的故事并提供改进建议。",
        buttons: {
          close: "关闭",
          review: "生成评审",
          reviewing: "评审中...",
          apply: "应用修改",
          applying: "应用中...",
        },
        credits: {
          review: "1 积分",
          apply: "10 积分",
        },
      },
      toast: {
        error: {
          title: "评审失败",
          description: "请重试",
        },
        applying: {
          title: "应用修改中",
          description: "AI 正在根据评审改进你的故事...",
        },
        applied: {
          title: "修改已应用",
          description: "你的故事已成功更新",
        },
        failed: {
          title: "应用修改失败",
          description: "请重试",
        },
        process: {
          error: {
            title: "错误",
            description: "故事处理失败",
          },
        },
      },
    },
    grammar: {
      dialog: {
        title: "快速语法检查",
        description: "自动修正所有段落中的基本拼写和语法错误。",
        features: {
          title: "此快速修正将：",
          spelling: "修正拼写错误",
          grammar: "修正基本语法错误",
          punctuation: "修正标点符号问题",
        },
        note: "注意：如需更全面的改进，请使用“评审与应用”功能。",
        credits: "此操作需要 2 积分。",
        buttons: {
          close: "关闭",
          fix: "修正语法",
          fixing: "修正中...",
        },
      },
      toast: {
        success: {
          description: "语法和拼写已修正",
        },
        error: {
          description: "语法修正失败",
          start: "开始语法检查失败",
        },
      },
    },
    clone: {
      dialog: {
        title: "克隆故事",
        description: "创建一个新的{orientation}版本，保留所有内容。",
        orientations: {
          horizontal: "横屏",
          vertical: "竖屏",
        },
        buttons: {
          cancel: "取消",
          clone: "克隆为{orientation}",
          cloning: "克隆中...",
          insufficient: "积分不足",
        },
      },
      toast: {
        success: {
          description: "故事克隆成功！正在跳转到新故事...",
        },
        error: {
          description: "克隆故事失败",
          insufficient: "积分不足",
        },
      },
    },
  },
} as const;
