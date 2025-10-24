/*
 * Copyright (c) 2022-2023  Physikalisch-Technische Bundesanstalt (PTB), all rights reserved.
 * This source code and software is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 * The software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with this Code.  If not, see http://www.gnu.org/licenses.
 * CONTACT: 		info@ptb.de
 * DEVELOPMENT:		https://d-si.ptb.de
 * AUTHORS:		Wafa El Jaoua, Tobias Hoffmann, Clifford Brown, Daniel Hutzschenreuter
 * LAST MODIFIED:		 06.10.23, 21:49
 */

package de.ptb.codataapi.repository;


import de.ptb.codataapi.model.Contribution;
import de.ptb.codataapi.model.Report;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import org.springframework.stereotype.Component;



//@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
//@Scope(WebApplicationContext.SCOPE_SESSION)


@Component
public class ContributionRepository implements Serializable {

        private static final long serialVersionUID = 1L;

        // Ein Map, das eine Liste von Contributions pro SessionID hält
        private final Map<String, List<Contribution>> sessionContributionsMap = new HashMap<>();
        private final Map<String, Report> sessionReportsMap = new HashMap<>();

        // Gibt alle Beiträge für eine spezifische Sitzung zurück
        public List<Contribution> getAllContributions(String sessionId) {
            return sessionContributionsMap.getOrDefault(sessionId, new ArrayList<>());
        }

        // Fügt einen neuen Beitrag für eine spezifische Sitzung hinzu
        public Contribution addContribution(String sessionId, Contribution c) {
            sessionContributionsMap.putIfAbsent(sessionId, new ArrayList<>());
            sessionContributionsMap.get(sessionId).add(c);
            return c;
        }

        // Löscht einen Beitrag anhand seiner ID für eine bestimmte Sitzung
        public boolean delete(String sessionId, Long id) {
            List<Contribution> contributions = sessionContributionsMap.get(sessionId);
            if (contributions != null) {
                return contributions.removeIf(x -> Objects.equals(x.getId(), id));
            }
            return false;
        }

        // Fügt einen Report für eine Sitzung hinzu
        public Report addReport(String sessionId, Report r) {
            sessionReportsMap.put(sessionId, r);
            return r;
        }

        // Holt den Report für eine Sitzung
        public Report getReport(String sessionId) {
            return sessionReportsMap.get(sessionId);
        }

        // Löscht alle Beiträge für eine bestimmte Sitzung
        public void deleteAll(String sessionId) {
            sessionContributionsMap.remove(sessionId);
        }

        // Gibt alle Reports zurück
        public List<Report> getAllReports() {
            return new ArrayList<>(sessionReportsMap.values());
        }
    }



//    private static final long serialVersionUID = 1L;
//
//    private final List<Contribution> contributionList = new ArrayList<>();
//    private final List<Report> reportList = new ArrayList<>();
//    private Report report = new Report();
//
//    public List<Contribution> getAllContributions() {
//        return contributionList;
//    }
//
//    public boolean delete(Long id) {
//        return contributionList.removeIf(x -> x.getId().equals(id));
//    }
//
//    public void deleteAll() {
//        contributionList.clear();
//    }
//
//    public Contribution update(Contribution p) {
//        delete(p.getId());
//        contributionList.add(p);
//        return p;
//    }
//
//    public Contribution addContribution(Contribution c) {
//        contributionList.add(c);
//        return c;
//    }
//
//    public Report addReport(Report r) {
//        report = r;
//        reportList.add(r);
//        return r;
//    }
//
//    public Report getReport() {
//        return report;
//    }
//
//    public List<Report> getAllReports() {
//        return reportList;
//    }
//}
