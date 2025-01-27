export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="space-y-10">
        {/* 标题区域 */}
        <header className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">隐私政策</h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>更新日期：2025年1月27日</p>
            <p>生效日期：2025年1月27日</p>
            <p>版本编号：YSZC-2025001</p>
          </div>
        </header>

        {/* 正文内容 */}
        <div className="space-y-10">
          {/* 前言 */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              欢迎您使用我们的AI视频生成服务，本服务由丽水市逐梦科技有限公司（以下简称"我们"）开发及运营。
              我们非常重视用户的隐私和个人信息保护，并严格遵守国家法律法规关于隐私和个人信息保护的相关规定。
            </p>

            {/* 目录 */}
            <div className="mt-8 bg-muted/50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">目录</h2>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>一、我们如何收集和使用您的信息</li>
                <li>二、我们如何共享、转让、公开披露您的个人信息</li>
                <li>三、我们如何保护和保存您的个人信息</li>
                <li>四、您如何管理个人信息</li>
                <li>五、未成年人信息保护</li>
                <li>六、通知和修订</li>
                <li>七、第三方服务声明</li>
                <li>八、我们的基本情况</li>
                <li>九、如何联系我们</li>
                <li>十、定义</li>
              </ul>
            </div>
          </section>

          {/* 各章节内容 */}
          <section className="space-y-8">
            {/* 第一章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                一、我们如何收集和使用您的信息
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  我们仅会出于本隐私政策所述的以下目的，收集和使用您的个人信息：
                </p>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）我们主要通过如下渠道收集您的个人信息：
                  </h3>
                  <ul className="ml-5 space-y-3 list-disc">
                    <li>
                      <p className="font-medium text-foreground">
                        您直接提供的信息：
                      </p>
                      <p className="mt-1">
                        我们收集您在使用服务过程中填写、提交、发布的信息，包括账户信息、企业信息、联系方式等。
                      </p>
                    </li>
                    <li>
                      <p className="font-medium text-foreground">
                        我们主动收集的信息：
                      </p>
                      <p className="mt-1">
                        在您使用我们的服务时，我们会记录您的使用情况、操作日志、设备信息等。
                      </p>
                    </li>
                    <li>
                      <p className="font-medium text-foreground">
                        我们从其他来源获取的信息：
                      </p>
                      <p className="mt-1">
                        在获得您同意的前提下，我们可能从关联公司、合作伙伴获取您授权共享的相关信息。
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）我们如何使用您的信息
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <h4 className="font-medium">收集场景及用途说明：</h4>
                    <ul className="ml-5 space-y-4 list-disc">
                      <li>
                        <div className="space-y-2">
                          <p className="font-medium">注册账号时：</p>
                          <ul className="ml-5 space-y-1 list-circle">
                            <li>
                              收集信息：姓名、手机号码、电子邮箱、企业信息等
                            </li>
                            <li>使用目的：创建和管理用户账号、提供基础服务</li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <div className="space-y-2">
                          <p className="font-medium">使用服务时：</p>
                          <ul className="ml-5 space-y-1 list-circle">
                            <li>
                              收集信息：上传的素材、生成的内容、使用记录等
                            </li>
                            <li>使用目的：提供AI视频生成服务、优化用户体验</li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 第二章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                二、我们如何共享、转让、公开披露您的个人信息
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）共享
                  </h3>
                  <p>我们不会与第三方共享您的个人信息，但以下情况除外：</p>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>获得您的明确同意</li>
                    <li>为提供服务必须与第三方共享（如云服务提供商）</li>
                    <li>法律法规规定或有权机关要求</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）转让
                  </h3>
                  <p>
                    我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
                  </p>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>获得您的明确同意</li>
                    <li>根据适用的法律法规规定</li>
                    <li>涉及合并、收购、资产转让等交易</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （三）公开披露
                  </h3>
                  <p>我们仅会在以下情况下，公开披露您的个人信息：</p>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>获得您的明确同意</li>
                    <li>基于法律法规的要求</li>
                    <li>维护公共安全和社会公共利益</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 第三章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                三、我们如何保护和保存您的个人信息
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）我们保护您个人信息的技术与措施
                  </h3>
                  <p>我们采取符合业界标准的安全防护措施保护您的个人信息：</p>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>采取加密技术对个人信息进行加密存储</li>
                    <li>设置严格的数据访问权限</li>
                    <li>定期进行安全评估</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）您个人信息的保存
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>我们将在中华人民共和国境内收集和存储您的个人信息</li>
                    <li>我们仅在必要的时间内保留您的个人信息</li>
                    <li>
                      超出保存期限后，我们会对您的个人信息进行删除或匿名化处理
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 第四章 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">四、您如何管理个人信息</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>您可以通过以下方式管理您的个人信息：</p>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                （一）访问和更正
              </h3>
              <p>您可以登录账号查看、更正您的基本资料。</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                （二）删除
              </h3>
              <p>在以下情形中，您可以向我们提出删除个人信息的请求：</p>
              <ul className="ml-5 space-y-2 list-disc">
                <li>处理目的已实现、无法实现或不再需要</li>
                <li>我们停止服务或运营</li>
                <li>您撤回同意</li>
                <li>我们违反法律法规或约定处理个人信息</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                （三）撤回同意
              </h3>
              <p>
                您可以通过联系我们撤回相关授权同意。但请理解，撤回同意不影响此前基于您的授权进行的信息处理。
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                （四）注销账号
              </h3>
              <p>
                您可以通过联系客服申请注销账号。注销后，我们将停止为您提供服务，并依据您的要求删除您的个人信息。
              </p>
            </div>
          </div>
        </div>

        {/* 第五章 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">五、未成年人信息保护</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>我们的服务主要面向成人。对于未成年人信息，我们特别说明：</p>
            <ul className="ml-5 space-y-2 list-disc">
              <li>未满18周岁的未成年人请勿注册账号</li>
              <li>如发现误收集未成年人信息，我们会及时删除</li>
              <li>
                若您是监护人，发现未成年人注册使用我们的服务，请及时联系我们
              </li>
            </ul>
          </div>
        </div>

        {/* 第六章 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">六、通知和修订</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>我们可能适时修改本隐私政策：</p>
            <ul className="ml-5 space-y-2 list-disc">
              <li>我们会在修改后通过网站公告或其他方式通知您</li>
              <li>对于重大变更，我们会专门通知您获取同意</li>
              <li>若您继续使用我们的服务，即视为同意修改后的隐私政策</li>
            </ul>
          </div>
        </div>

        {/* 第七章 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">七、第三方服务声明</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              我们的服务可能包含第三方提供的功能（如支付服务）。这些第三方可能获取您的某些信息。请注意：
            </p>
            <ul className="ml-5 space-y-2 list-disc">
              <li>第三方有独立的隐私政策</li>
              <li>我们不对第三方的隐私保护负责</li>
              <li>建议您查看相关第三方的隐私政策</li>
            </ul>
          </div>
        </div>

        {/* 第八章 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">八、我们的基本情况</h2>
          <div className="space-y-4 text-muted-foreground">
            <ul className="ml-5 space-y-2 list-disc">
              <li>公司名称：丽水市逐梦科技有限公司</li>
              <li>注册地址：浙江省丽水市莲都区丽园19幢1003室</li>
              <li>联系邮箱：hhwjsw711@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* 第九章 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">九、如何联系我们</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              如您对本隐私政策或个人信息保护有任何问题，可通过以下方式联系我们：
            </p>
            <ul className="ml-5 space-y-2 list-disc">
              <li>电子邮箱：hhwjsw711@gmail.com</li>
              <li>工作时间：周一至周五 9:00-18:00</li>
            </ul>
            <p>我们收到您的问题后，会在15个工作日内回复。</p>
          </div>
        </div>

        {/* 第十章 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">十、定义</h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <p>
                <span className="font-medium text-foreground">个人信息：</span>
                指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
              </p>
              <p>
                <span className="font-medium text-foreground">
                  个人敏感信息：
                </span>
                指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。
              </p>
            </div>
          </div>
        </div>

        {/* 底部联系方式 */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="space-y-4 text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground">联系我们</h2>
            <p>
              如您对本隐私政策或个人信息保护有任何问题，可通过以下方式联系我们：
            </p>
            <ul className="ml-5 space-y-2 list-disc">
              <li>电子邮箱：hhwjsw711@gmail.com</li>
              <li>工作时间：周一至周五 9:00-18:00</li>
            </ul>
            <p className="text-sm">
              我们收到您的问题后，会在15个工作日内回复。
            </p>
          </div>
        </footer>
      </article>
    </div>
  );
}
