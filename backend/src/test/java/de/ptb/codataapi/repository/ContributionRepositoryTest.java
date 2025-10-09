/*
 * Copyright (c) 2022-2024  Physikalisch-Technische Bundesanstalt (PTB), all rights reserved.
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
 * LAST MODIFIED:		 12.01.24, 14:50
 */

package de.ptb.codataapi.repository;

import de.ptb.codataapi.model.Contribution;
import de.ptb.codataapi.model.Report;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContributionRepositoryTest {

    @InjectMocks
    private ContributionRepository repository;
    @Mock
    private List<Contribution> contributionList;

    private Report report;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void should_return_participantList() {
        when(contributionList.size()).thenReturn(1);
        List<Contribution> resultParticipantList = repository.getAllContributions();
        assertNotNull(resultParticipantList);
        assertEquals(1, resultParticipantList.size());
    }

    @Test
    void should_return_participant_isRemoved() {
        //when
        when(contributionList.removeIf(any())).thenReturn(true);
        //then
        boolean isParticipantRemoved = repository.delete(1L);
        //verify
        assertTrue(isParticipantRemoved);
        verify(contributionList, times(1)).removeIf(any());
    }

    @Test
    void should_return_participant_isNotRemoved() {
        //when
        when(contributionList.removeIf(any())).thenReturn(false);
        //then
        boolean isParticipantRemoved = repository.delete(6L);
        //verify
        assertFalse(isParticipantRemoved);
        verify(contributionList, times(1)).removeIf(any());

    }

//    @Test
//    void should_return_addedParticipant() {
//        //when
//        Contribution contribution = new Contribution(1L, "PTB_2", "http://localhost:8085/api/d-dcc/dcc/Temp_Comparison_PTB_2","reference");
//        when(contributionList.add(contribution)).thenReturn(true);
//        //then
//        Contribution participantExpected = repository.addContribution(contribution);
//        //verify
//        assertNotNull(participantExpected);
//        assertEquals(contribution, participantExpected);
//    }

//    @Test
//    void should_return_addedReport() {
//        //given
//        Contribution participant1 = new Contribution(1L, "NPL", "CCM.M-K1-NPL9507");
//        Contribution participant2 = new Contribution(2L, "PTB", "CCM.M-K1-PTB9608");
//        List<Contribution> participantList = List.of(participant1, participant2);
//        report = new Report("CCM-KC1", participantList);
//        //when
//        Report reportExpected = repository.addReport(report);
//        //then
//        assertNotNull(reportExpected);
//        assertEquals(report, reportExpected);
//    }

}