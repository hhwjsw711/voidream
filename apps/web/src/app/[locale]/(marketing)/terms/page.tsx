export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <article className="space-y-10">
        {/* 标题区域 */}
        <header className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">服务条款</h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>更新日期：2025年1月27日</p>
            <p>生效日期：2025年1月27日</p>
            <p>版本编号：FWTK-2025001</p>
          </div>
        </header>

        {/* 正文内容 */}
        <div className="space-y-10">
          {/* 前言 */}
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              欢迎使用我们的AI视频生成服务，本服务由丽水市逐梦科技有限公司（以下简称"我们"）开发及运营。为使用本服务，您应当阅读并遵守本《服务条款》（"本条款"）。
            </p>

            {/* 重要提示 */}
            <div className="mt-8 bg-muted/50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">重要提示</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  在接受本条款之前，请您务必审慎阅读本条款的全部内容。其中，免除或限制责任的条款将以加粗的方式提示您注意，请您重点阅读。
                </p>
                <p>
                  您通过网页点击确认本条款或实际使用本服务即表示您确认：您具有与我们达成具有约束力的合同所需的民事权利能力和民事行为能力。如果您未满18周岁，请在监护人的陪同下阅读本条款，并在征得监护人的同意后使用本服务。
                </p>
              </div>
            </div>

            {/* 目录 */}
            <div className="mt-8 bg-muted/50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">目录</h2>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>一、通则</li>
                <li>二、账号管理</li>
                <li>三、服务内容与规则</li>
                <li>四、用户义务与承诺</li>
                <li>五、费用规则</li>
                <li>六、知识产权</li>
                <li>七、数据保护与隐私</li>
                <li>八、责任限制</li>
                <li>九、协议终止</li>
                <li>十、法律适用与争议解决</li>
                <li>十一、其他条款</li>
              </ul>
            </div>
          </section>

          {/* 各章节内容 */}
          <section className="space-y-8">
            {/* 第一章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">一、通则</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）服务定义
                  </h3>
                  <p>
                    本服务指我们提供的AI视频生成产品、服务、文档、软件和其他服务。该等服务将根据您的订单约定向您提供（具体以实际提供的为准），您可以根据自己的需求选择使用一项或多项具体服务并遵守其服务规则。
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）服务规则
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>
                      适用于具体服务的服务内容、服务等级、技术规范、操作文档、计费标准等内容的服务规则，以官网展示的届时有效的内容为准
                    </li>
                    <li>
                      我们可能会根据业务调整情况对服务规则进行修改，修改后的服务规则将在官网公示后生效
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 第二章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">二、账号管理</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）账号注册
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>
                      您应依法具备必要、适当的权利能力和行为能力，按照我们的要求提交资料，完成注册
                    </li>
                    <li>
                      您应当使用您享有合法权益的身份信息进行注册，并保证提供的所有注册信息真实、准确、完整
                    </li>
                    <li>如您提供的信息不准确或发生变更，应及时更新相关信息</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）账号安全
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>您应当对账号安全负责，包括但不限于：</p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>妥善保管账号和密码，不得将账号提供给他人使用</li>
                      <li>定期修改密码，避免使用简单密码</li>
                      <li>发现账号被他人非法使用时，应立即通知我们</li>
                    </ul>
                    <p className="font-medium">
                      <strong>
                        因您未尽账号安全保护义务，导致的一切损失由您自行承担。
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 第三章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">三、服务内容与规则</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）服务内容
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>AI视频生成及相关技术服务</li>
                    <li>技术支持和咨询服务</li>
                    <li>其他双方约定的服务内容</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）服务规则
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <h4 className="font-medium">您应当遵守以下规则：</h4>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>遵守法律法规和服务规则</li>
                      <li>按照约定支付服务费用</li>
                      <li>不得从事任何违法违规行为</li>
                      <li>不得损害其他用户或第三方的合法权益</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （三）服务变更
                  </h3>
                  <p>
                    为了向您提供更好的服务，我们可能会适时对服务内容进行变更：
                  </p>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>对于重大变更，我们会提前通知您</li>
                    <li>变更后的服务内容将在官网公示后生效</li>
                    <li>如您不同意变更，可以停止使用相关服务或终止本协议</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 第四章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">四、用户义务与承诺</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）合法使用
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>您承诺使用本服务时：</p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>遵守国家法律法规</li>
                      <li>不侵犯他人知识产权</li>
                      <li>不传播违法违规内容</li>
                      <li>不从事危害网络安全的行为</li>
                    </ul>
                    <p className="font-medium">
                      <strong>
                        违反上述承诺的，我们有权立即终止服务，并追究您的相关责任。
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）内容规范
                  </h3>
                  <p>您生成、上传、发布的内容应当：</p>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>符合法律法规要求</li>
                    <li>尊重他人知识产权</li>
                    <li>不含有违法违规信息</li>
                    <li>不侵犯他人合法权益</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 第五章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">五、费用规则</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）费用标准
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>服务费用以官网展示或订单约定为准</li>
                    <li>我们可能会根据运营情况调整费用标准</li>
                    <li>费用调整将提前在官网公示</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）支付规则
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>关于费用支付，您需要注意：</p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>应当按照约定的方式和时间支付费用</li>
                      <li>预付费服务需在服务开始前支付</li>
                      <li>后付费服务需按时支付账单</li>
                    </ul>
                    <p className="font-medium">
                      <strong>
                        如您未及时付款，我们有权：
                        <ul className="ml-5 mt-2 space-y-1 list-disc">
                          <li>暂停或终止服务</li>
                          <li>要求支付违约金</li>
                          <li>采取法律措施追讨欠款</li>
                        </ul>
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 第六章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">六、知识产权</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）权利归属
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>关于知识产权归属：</p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>我们拥有本服务的全部知识产权</li>
                      <li>您使用本服务不构成知识产权的转让</li>
                      <li>您上传的原创内容的知识产权归您所有</li>
                      <li>
                        <strong>
                          使用我们的服务生成的内容，其知识产权归属按具体服务规则确定
                        </strong>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）使用限制
                  </h3>
                  <p>未经我们书面许可，您不得：</p>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>复制、修改或创建衍生作品</li>
                    <li>反向工程、反编译或反汇编</li>
                    <li>删除或修改版权信息</li>
                    <li>将服务转让或授权给第三方使用</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 第七章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">七、数据保护与隐私</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）数据保护
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>我们重视您的数据安全：</p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>采用业界标准的安全技术和程序</li>
                      <li>定期进行安全评估和升级</li>
                      <li>严格控制数据访问权限</li>
                      <li>
                        <strong>
                          但请理解，互联网环境并非百分之百安全，我们不对因第三方原因导致的数据泄露承担责任
                        </strong>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）隐私保护
                  </h3>
                  <p>
                    我们会按照《隐私政策》收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意我们按照《隐私政策》处理您的个人信息。
                  </p>
                </div>
              </div>
            </div>

            {/* 第八章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">八、责任限制</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）免责声明
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>
                      <strong>
                        在法律允许的最大范围内，以下情况我们不承担责任：
                      </strong>
                    </p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>因不可抗力导致的服务中断或损失</li>
                      <li>因网络服务质量、系统故障、数据丢失等引起的损失</li>
                      <li>因第三方原因（如黑客攻击）导致的损失</li>
                      <li>因您自身原因（如操作不当）导致的损失</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）责任限制
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>
                      <strong>我们的责任限制包括：</strong>
                    </p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>不对服务的适销性、适用性作任何明示或暗示的保证</li>
                      <li>不保证服务不会中断或无错误</li>
                      <li>
                        不对任何间接损失承担责任，包括：
                        <ul className="ml-5 mt-2 space-y-1 list-disc">
                          <li>利润损失</li>
                          <li>业务中断</li>
                          <li>商誉损失</li>
                          <li>数据丢失</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 第九章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">九、协议终止</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）终止情形
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>您主动终止使用本服务</li>
                    <li>您违反本条款，我们有权终止服务</li>
                    <li>因法律法规要求终止服务</li>
                    <li>因业务调整等原因终止服务</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）终止后处理
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <p>协议终止后：</p>
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>您应支付所有未付费用</li>
                      <li>我们将停止提供服务</li>
                      <li>您应自行备份数据，我们可能会删除您的数据</li>
                      <li>已产生的权利义务不受影响</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 第十章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">十、法律适用与争议解决</h2>
              <div className="space-y-4 text-muted-foreground">
                <ul className="ml-5 space-y-2 list-disc">
                  <li>本条款适用中华人民共和国法律</li>
                  <li>争议应首先通过友好协商解决</li>
                  <li>
                    协商不成的，任何一方均可向本公司所在地有管辖权的人民法院提起诉讼
                  </li>
                </ul>
              </div>
            </div>

            {/* 第十一章 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">十一、其他条款</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （一）条款效力
                  </h3>
                  <ul className="ml-5 space-y-2 list-disc">
                    <li>本条款构成完整的协议</li>
                    <li>任何条款无效不影响其他条款的效力</li>
                    <li>标题仅供参考，不影响条款解释</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-medium text-foreground">
                    （二）条款修改
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <ul className="ml-5 space-y-2 list-disc">
                      <li>我们保留修改本条款的权利</li>
                      <li>修改后的条款将在官网公示</li>
                      <li>继续使用服务即表示同意修改后的条款</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 底部联系方式 */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="space-y-4 text-muted-foreground">
              <h2 className="text-lg font-semibold text-foreground">
                联系我们
              </h2>
              <p>如您对本条款有任何疑问，请通过以下方式联系我们：</p>
              <ul className="ml-5 space-y-2 list-disc">
                <li>公司名称：丽水市逐梦科技有限公司</li>
                <li>注册地址：浙江省丽水市莲都区丽园19幢1003室</li>
                <li>电子邮箱：hhwjsw711@gmail.com</li>
                <li>工作时间：周一至周五 9:00-18:00</li>
              </ul>
              <p className="text-sm">
                我们收到您的问题后，会在15个工作日内回复。
              </p>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
