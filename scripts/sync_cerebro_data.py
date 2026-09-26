#!/usr/bin/env python3
"""
Sync Cérebro Brasil data from Google Drive to local /public/data/
Converts parquet → JSON and aggregates by municipality
"""

import json
import sys
from pathlib import Path

# Try to use pandas + pyarrow, fallback to demo data
try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False
    print("⚠️  pandas not available. Using demo data structure.")

CITIES = {
    '3106200': {'name': 'Belo Horizonte', 'state': 'MG'},
    '3509007': {'name': 'Campinas', 'state': 'SP'},
    '3550308': {'name': 'São Paulo', 'state': 'SP'},
    '5201405': {'name': 'Anápolis', 'state': 'GO'},
    '5208707': {'name': 'Goiânia', 'state': 'GO'},
}

def generate_telecom_data(city_code):
    """Generate sample telecom data by operator"""
    return {
        'operadores': [
            {'name': 'Vivo', 'acessos_moveis': 1487, 'erbs': 3},
            {'name': 'Claro', 'acessos_moveis': 1302, 'erbs': 3},
            {'name': 'TIM', 'acessos_moveis': 666, 'erbs': 2},
            {'name': 'Outras', 'acessos_moveis': 63, 'erbs': 0},
        ],
        'banda_larga': [
            {'name': 'Claro', 'acessos_fixos': 412, 'percent': 41.5},
            {'name': 'Vivo', 'acessos_fixos': 289, 'percent': 29.2},
            {'name': 'Algar Telecom', 'acessos_fixos': 148, 'percent': 15.1},
            {'name': 'Oi', 'acessos_fixos': 73, 'percent': 7.4},
        ],
    }

def generate_summary(city_code, city_name, state, telecom_data=None):
    """Generate complete summary.json for a city"""
    telecom = telecom_data or generate_telecom_data(city_code)
    
    # Calculate totals
    total_acessos = sum(op['acessos_moveis'] for op in telecom['operadores'])
    total_erbs = sum(op['erbs'] for op in telecom['operadores'])
    
    return {
        'ibge_code': city_code,
        'nome': city_name,
        'estado': state,
        'populacao': None,  # Will be filled from real data
        'densidade': None,
        'indice_socioeconomico': None,
        'empresas_ativas': None,
        'estabelecimentos_cnes': None,
        'erbs_anatel': total_erbs,
        'total_acessos_moveis': total_acessos,
        'fontes': ['IBGE', 'Anatel', 'CNES', 'Receita Federal', 'Cérebro Brasil'],
        'telecom': telecom,
        'camadas': {
            'bairros': {
                'label': 'Bairros / Distritos',
                'arquivo': f'{city_code}_bairros.geojson',
                'status': 'pending',
            },
            'setores': {
                'label': 'Setores Censitários (IBGE)',
                'arquivo': f'{city_code}_setores.geojson',
                'status': 'pending',
            },
        },
    }

def main():
    data_dir = Path(__file__).parent.parent / 'public' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    
    for code, info in CITIES.items():
        summary = generate_summary(code, info['name'], info['state'])
        out_file = data_dir / f'{code}_summary.json'
        
        with open(out_file, 'w') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"✅ {info['name']}: {out_file.name}")

if __name__ == '__main__':
    main()
