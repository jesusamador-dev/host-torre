import React, {useEffect, useCallback} from 'react';
import useAuthStore from 'mf_mesacyc_dashboards_common/useAuthStore';
import {useGlobalStore} from 'mf_mesacyc_dashboards_common/GlobalStore';
import {getCurrentWeekItem} from 'mf_mesacyc_dashboards_common/getCurrentWeekItem';
import {filtersFromParams} from 'mf_mesacyc_dashboards_common/filtersFromParams';
import GlobalService from '@/domain/services/global/GlobalService';
import {initialState} from 'mf_mesacyc_dashboards_common/GlobalStore';

interface GlobalProviderProps {
  children: React.ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({children}) => {
  const {
    updateGlobalStore,
    globalLastUpdate,
    timestamp,
    filtroFecha,
    filtroGeografia,
    weeks,
    canReload,
  } = useGlobalStore();

  const {token} = useAuthStore();
  const hydrated = useGlobalStore((state) => state.hydrated);

  const updateFiltersAndData = useCallback(async () => {
    if (!token || !hydrated) return {};

    try {
      const today = new Date().toLocaleDateString().slice(0, 10);
      const shouldUpdate = globalLastUpdate !== today;
      const allValuesEmpty = Object.values(filtroFecha).every(
        (value) => value === null || value === ''
      );
      const hasWeeks = weeks.data?.length >= 0;

      const searchParams = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (shouldUpdate || !hasWeeks || allValuesEmpty) {
        updateGlobalStore({
          geographies: {statusCode: null, data: null},
          weeks: {statusCode: null, data: null},
        });

        // Actualiza la información de los filtros
        const service = new GlobalService();
        const {geographies, weeks: newWeeks} = await service.getFilters(token);
        const currentWeeks = getCurrentWeekItem(newWeeks.data);
        const newFilters = filtersFromParams({filtroFecha, filtroGeografia}, params, currentWeeks);

        updateGlobalStore({
          geographies,
          weeks: newWeeks,
          globalLastUpdate: today,
          filtroFecha: newFilters.filtroFecha,
          filtroGeografia: initialState.filtroGeografia,
        });
      } else {
        const currentWeeks = getCurrentWeekItem(weeks.data === null ? [] : weeks.data);
        const newFilters = filtersFromParams({filtroFecha, filtroGeografia}, params, currentWeeks);
        if (
          filtroFecha.numSemana !== newFilters.filtroFecha.numSemana ||
          filtroFecha.fechaFinSemanas !== newFilters.filtroFecha.fechaFinSemanas
        ) {
          updateGlobalStore({
            weeks,
            filtroFecha: newFilters.filtroFecha,
          });
        }
      }
    } catch (error) {
      updateGlobalStore({timestamp: Date.now(), canReload: true});
    }
  }, [token, hydrated]);

  useEffect(() => {
    updateFiltersAndData();
  }, [updateFiltersAndData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
      const currentTime = Date.now();

      if (currentTime - timestamp >= FIVE_MINUTES_IN_MS) {
        // permitir una recarga
        updateGlobalStore({timestamp: currentTime, canReload: true});
      }
    }, 30000); // 30 segundos

    return () => clearInterval(intervalId);
  }, []);

  return <>{children}</>;
};

export default GlobalProvider;
