import pandas as pd
import plotly.express as px
import streamlit as st

st.set_page_config(
    page_title="Dashboard do Gêmeo Digital",
    page_icon="🏢",
    layout="wide",
)

@st.cache_data
def load_data():
    return pd.read_csv("data/sensor_readings.csv")

df = load_data()

st.title("🏢 Dashboard Operacional do Gêmeo Digital")
st.caption("Edifício inteligente com sensores de temperatura, CO₂, ocupação e energia.")

with st.sidebar:
    st.header("Filtros")
    rooms = st.multiselect(
        "Ambientes",
        options=sorted(df["room_name"].unique()),
        default=sorted(df["room_name"].unique()),
    )
    metric = st.selectbox(
        "Métrica temporal",
        ["temperature_c", "co2_ppm", "occupancy", "energy_kw"],
        format_func=lambda x: {
            "temperature_c": "Temperatura (°C)",
            "co2_ppm": "CO₂ (ppm)",
            "occupancy": "Ocupação",
            "energy_kw": "Energia (kW)",
        }[x],
    )

filtered = df[df["room_name"].isin(rooms)]
latest_time = filtered["time"].max()
latest = filtered[filtered["time"] == latest_time]

criticos = int((latest["status"] == "critico").sum())
atencao = int((latest["status"] == "atencao").sum())
energia_total = latest["energy_kw"].sum()
co2_medio = latest["co2_ppm"].mean()

c1, c2, c3, c4 = st.columns(4)
c1.metric("Ambientes críticos", criticos)
c2.metric("Ambientes em atenção", atencao)
c3.metric("Energia total", f"{energia_total:.1f} kW")
c4.metric("CO₂ médio", f"{co2_medio:.0f} ppm")

left, right = st.columns([2, 1])

with left:
    st.subheader("Tendência temporal")
    fig = px.line(
        filtered,
        x="time",
        y=metric,
        color="room_name",
        markers=True,
        labels={
            "time": "Horário",
            "temperature_c": "Temperatura (°C)",
            "co2_ppm": "CO₂ (ppm)",
            "occupancy": "Ocupação",
            "energy_kw": "Energia (kW)",
            "room_name": "Ambiente",
        },
    )
    st.plotly_chart(fig, use_container_width=True)

with right:
    st.subheader("Estado atual")
    status_order = pd.CategoricalDtype(["normal", "atencao", "critico"], ordered=True)
    table = latest.copy()
    table["status"] = table["status"].astype(status_order)
    table = table.sort_values("status", ascending=False)
    st.dataframe(
        table[["room_name", "temperature_c", "co2_ppm", "occupancy", "energy_kw", "status"]],
        use_container_width=True,
        hide_index=True,
    )

st.subheader("Alertas e recomendações")
alerts = latest[latest["status"].isin(["atencao", "critico"])].copy()
if alerts.empty:
    st.success("Nenhum alerta no momento.")
else:
    for _, row in alerts.iterrows():
        if row["co2_ppm"] > 850:
            action = "Aumentar ventilação ou reduzir ocupação."
        elif row["temperature_c"] > 25.5:
            action = "Verificar HVAC e setpoint de climatização."
        else:
            action = "Monitorar tendência nos próximos minutos."
        if row["status"] == "critico":
            st.error(f"{row['room_name']}: {row['status'].upper()} — {action}")
        else:
            st.warning(f"{row['room_name']}: atenção — {action}")

st.subheader("Por que isso é um exemplo de interface de Gêmeo Digital?")
st.markdown(
    """
- **Monitorar:** KPIs indicam estado atual do edifício.
- **Visualizar:** séries temporais mostram tendência e comparação entre salas.
- **Diagnosticar:** tabela e alertas destacam onde há risco.
- **Apoiar decisão:** recomendações sugerem ações operacionais.
    """
)
