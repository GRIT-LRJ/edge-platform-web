import { render, screen } from '@testing-library/vue'

import ProductWorkflowVisual from './ProductWorkflowVisual.vue'

describe('产品工作流视觉', () => {
  it.each([
    ['parameter-alarm', '参数与报警管理动画'],
    ['sfc', 'SFC 流程编排动画'],
    ['monitoring', '设备 HMI 运行监控动画'],
  ] as const)('渲染 %s 产品界面并提供准确标签', (kind, label) => {
    const { container } = render(ProductWorkflowVisual, {
      props: {
        kind,
        label,
        controlled: true,
        playing: true,
        durationMs: 20_000,
      },
    })

    expect(screen.getByRole('img', { name: label })).toBeVisible()
    expect(container.querySelector('[data-workflow-visual="' + kind + '"]')).toHaveAttribute(
      'data-playing',
      'true',
    )
    expect(container.querySelector('[data-platform-chrome="shared"]')).toBeInTheDocument()
    expect(container.querySelector('[data-platform-body="true"]')).toHaveAttribute(
      'transform',
      'translate(0 -16)',
    )
  })

  it.each([
    ['parameter-alarm', '.product-workflow__parameter-project > rect', '494'],
    ['sfc', '.product-workflow__sfc-canvas', '447'],
    ['monitoring', '.product-workflow__monitor-shell', '494'],
  ] as const)('让 %s 的结构背景承接紧凑顶栏释放的空间', (kind, selector, height) => {
    const { container } = render(ProductWorkflowVisual, {
      props: { kind, label: `${kind} 紧凑顶栏`, controlled: true, playing: false },
    })

    expect(container.querySelector(selector)).toHaveAttribute('height', height)
  })

  it('受控的减少动态模式展示静态终态', () => {
    const { container } = render(ProductWorkflowVisual, {
      props: {
        kind: 'sfc',
        label: 'SFC 静态终态',
        controlled: true,
        playing: false,
        reducedMotion: true,
      },
    })

    expect(container.querySelector('[data-workflow-visual="sfc"]')).toHaveAttribute(
      'data-static',
      'true',
    )
  })

  it('参数与报警动画提供四个编辑器页签和四个连续阶段', () => {
    const { container } = render(ProductWorkflowVisual, {
      props: {
        kind: 'parameter-alarm',
        label: '参数与报警清晰版动画',
        controlled: true,
        playing: true,
        durationMs: 16_000,
      },
    })

    expect(container.querySelectorAll('[data-workflow-tab]')).toHaveLength(4)
    expect(container.querySelectorAll('[data-workflow-stage]')).toHaveLength(4)
    expect(container.querySelectorAll('[data-workflow-tab-icon]')).toHaveLength(4)
    expect(
      Array.from(container.querySelectorAll('[data-workflow-tab]'), (tab) => tab.textContent),
    ).toEqual(['参数配置', '参数管理', '报警规则', '处置追溯'])
    expect(container.querySelector('[data-platform-region="editor-tabs"] > rect')).toHaveAttribute(
      'height',
      '27',
    )
    expect(container).not.toHaveTextContent('01参数配置')
    expect(container.querySelector('[data-platform-chrome="shared"]')).toBeInTheDocument()
    expect(container.querySelector('[data-workflow-visual="parameter-alarm"]')).toHaveStyle({
      '--workflow-duration': '16000ms',
    })
  })
})
