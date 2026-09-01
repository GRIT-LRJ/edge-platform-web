import { render, screen } from '@testing-library/vue'
import { nextTick } from 'vue'

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
      'translate(0 -12)',
    )
  })

  it.each([
    ['parameter-alarm', '.product-workflow__parameter-project > rect', '490'],
    ['sfc', '.product-workflow__sfc-canvas', '443'],
    ['monitoring', '.product-workflow__monitor-shell', '490'],
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
    const editorTabs = container.querySelector('[data-platform-region="editor-tabs"]')
    expect(editorTabs).not.toBeNull()
    expect(editorTabs?.querySelector('rect')).toHaveAttribute('x', '126')
    expect(editorTabs?.querySelector('rect')).toHaveAttribute('height', '27')
    expect(
      Array.from(editorTabs?.querySelectorAll('[data-workflow-tab]') ?? [], (tab) =>
        tab.getAttribute('transform'),
      ),
    ).toEqual(['translate(126 44)', 'translate(210 44)', 'translate(294 44)', 'translate(378 44)'])
    expect(
      Array.from(editorTabs?.querySelectorAll('[data-workflow-tab] rect') ?? [], (rect) =>
        rect.getAttribute('width'),
      ),
    ).toEqual(['84', '84', '84', '84'])
    expect(container).not.toHaveTextContent('01参数配置')
    expect(container.querySelectorAll('[data-workflow-region="parameter-category-tree"]')).toHaveLength(1)
    expect(container.querySelectorAll('[data-workflow-region="alarm-group-tree"]')).toHaveLength(1)
    expect(container.querySelectorAll('.product-workflow__alarm-tree-dot')).toHaveLength(3)
    const drillingDiagram = container.querySelector('[data-workflow-diagram="borehole"]')
    expect(drillingDiagram).toHaveTextContent('钻孔参数')
    expect(drillingDiagram).toHaveTextContent('绑定正常')
    expect(drillingDiagram).toHaveTextContent('当前 2.30m')
    expect(drillingDiagram).toHaveTextContent('目标 3.00m')
    expect(drillingDiagram).toHaveTextContent('$mdl.depth')
    expect(container.querySelector('.product-workflow__cursor--parameter')).toBeNull()
    expect(container.querySelector('[data-workflow-stage="parameter-management"]')).not.toHaveTextContent(
      '钻进',
    )
    expect(container.querySelector('[data-platform-chrome="shared"]')).toBeInTheDocument()
    expect(container.querySelector('[data-workflow-visual="parameter-alarm"]')).toHaveStyle({
      '--workflow-duration': '16000ms',
    })
  })
})

describe('设备监控动态数据', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  function renderMonitoring() {
    return render(ProductWorkflowVisual, {
      props: {
        kind: 'monitoring',
        label: '设备监控动态数据',
        controlled: true,
        playing: true,
        durationMs: 18_000,
      },
    })
  }

  function query(container: HTMLElement, selector: string) {
    const element = container.querySelector(selector)
    expect(element).not.toBeNull()
    return element as SVGElement
  }

  it('按秒更新传感器和时钟，并让深度、填充条与圆点保持等比例', async () => {
    vi.useFakeTimers()
    const { container } = renderMonitoring()

    expect(query(container, '[data-monitoring-clock="refresh"]')).toHaveTextContent(
      '实时刷新 · 10:42:18',
    )
    expect(query(container, '[data-monitoring-clock="duration"]')).toHaveTextContent('08:42')
    expect(query(container, '[data-monitoring-depth="value"]')).toHaveTextContent('2.30 / 3.20 m')
    expect(query(container, '[data-monitoring-depth="bar"]')).toHaveAttribute('width', '270.25')
    expect(query(container, '[data-monitoring-depth="marker"]')).toHaveAttribute('cx', '808.25')

    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()

    expect(query(container, '[data-monitoring-clock="refresh"]')).toHaveTextContent(
      '实时刷新 · 10:42:19',
    )
    expect(query(container, '[data-monitoring-clock="duration"]')).toHaveTextContent('08:43')
    expect(query(container, '[data-monitoring-gauge="rpm"]')).toHaveTextContent('97')
    expect(query(container, '[data-monitoring-gauge="pressure"]')).toHaveTextContent('12.7')
    expect(query(container, '[data-monitoring-gauge="feed"]')).toHaveTextContent('69')
    expect(container.querySelectorAll('.product-workflow__gauge-needle')[0]).toHaveStyle({
      transform: 'rotate(2deg)',
    })
    expect(container.querySelectorAll('.product-workflow__gauge-needle')[1]).toHaveStyle({
      transform: 'rotate(2deg)',
    })
    expect(container.querySelectorAll('.product-workflow__gauge-needle')[2]).toHaveStyle({
      transform: 'rotate(4deg)',
    })
    expect(query(container, '[data-monitoring-metric="water-flow"]')).toHaveTextContent('30.1 L/min')
    expect(query(container, '[data-monitoring-metric="water-pressure"]')).toHaveTextContent('4.2 MPa')

    await vi.advanceTimersByTimeAsync(8000)
    await nextTick()

    expect(query(container, '[data-monitoring-depth="value"]')).toHaveTextContent('2.75 / 3.20 m')
    const progressWidth = Number(query(container, '[data-monitoring-depth="bar"]').getAttribute('width'))
    const markerX = Number(query(container, '[data-monitoring-depth="marker"]').getAttribute('cx'))
    expect(progressWidth).toBeCloseTo((2.75 / 3.2) * 376, 8)
    expect(markerX).toBeCloseTo(538 + progressWidth, 8)
  })

  it('暂停时冻结全部监控数据，恢复后续播，重播时回到初始值', async () => {
    vi.useFakeTimers()
    const { container, rerender } = renderMonitoring()

    await vi.advanceTimersByTimeAsync(2000)
    await nextTick()
    const elapsedRefresh = query(container, '[data-monitoring-clock="refresh"]').textContent
    const elapsedDepth = query(container, '[data-monitoring-depth="value"]').textContent

    await rerender({ playing: false })
    await vi.advanceTimersByTimeAsync(4000)
    await nextTick()
    expect(query(container, '[data-monitoring-clock="refresh"]')).toHaveTextContent(elapsedRefresh ?? '')
    expect(query(container, '[data-monitoring-depth="value"]')).toHaveTextContent(elapsedDepth ?? '')

    await rerender({ playing: true })
    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()
    expect(query(container, '[data-monitoring-clock="refresh"]')).toHaveTextContent(
      '实时刷新 · 10:42:21',
    )
    expect(query(container, '[data-monitoring-depth="value"]')).toHaveTextContent('2.45 / 3.20 m')

    await rerender({ replayKey: 1 })
    await nextTick()
    expect(query(container, '[data-monitoring-clock="refresh"]')).toHaveTextContent(
      '实时刷新 · 10:42:18',
    )
    expect(query(container, '[data-monitoring-clock="duration"]')).toHaveTextContent('08:42')
    expect(query(container, '[data-monitoring-depth="value"]')).toHaveTextContent('2.30 / 3.20 m')
  })

  it('18秒后整段监控数据同步回到起始快照', async () => {
    vi.useFakeTimers()
    const { container } = renderMonitoring()

    await vi.advanceTimersByTimeAsync(18_000)
    await nextTick()

    expect(query(container, '[data-monitoring-clock="refresh"]')).toHaveTextContent(
      '实时刷新 · 10:42:18',
    )
    expect(query(container, '[data-monitoring-clock="duration"]')).toHaveTextContent('08:42')
    expect(query(container, '[data-monitoring-gauge="rpm"]')).toHaveTextContent('96')
    expect(query(container, '[data-monitoring-metric="water-flow"]')).toHaveTextContent('30.0 L/min')
    expect(query(container, '[data-monitoring-depth="value"]')).toHaveTextContent('2.30 / 3.20 m')
  })

  it('减少动态时展示初始静态快照', () => {
    const { container } = render(ProductWorkflowVisual, {
      props: {
        kind: 'monitoring',
        label: '设备监控静态快照',
        controlled: true,
        playing: false,
        reducedMotion: true,
      },
    })

    expect(query(container, '[data-workflow-visual="monitoring"]')).toHaveAttribute(
      'data-static',
      'true',
    )
    expect(query(container, '[data-monitoring-clock="refresh"]')).toHaveTextContent(
      '实时刷新 · 10:42:18',
    )
    expect(query(container, '[data-monitoring-depth="value"]')).toHaveTextContent('2.30 / 3.20 m')
  })
})
