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
 * LAST MODIFIED:		 14.01.24, 16:02
 */

package de.ptb.codataapi.service;

import de.ptb.codataapi.model.Contribution;
import de.ptb.codataapi.repository.ContributionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ContributionsServiceImplTest {
    @InjectMocks
    private ContributionsServiceImpl service;
    @Mock
    private ContributionRepository repository;

    private List<Contribution> participantList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Contribution participant1 = new Contribution(1L, "PTB_2", "http://localhost:8085/api/d-dcc/dcc/Temp_Comparison_PTB_1","reference");
        Contribution participant2 = new Contribution(2L, "PTB_2", "http://localhost:8085/api/d-dcc/dcc/Temp_Comparison_PTB_2","reference");
        participantList = List.of(participant1, participant2);

    }

    @Test
    void should_return_participantList() {
        //Mock the call
        when(repository.getAllContributions()).thenReturn(participantList);
        //when
        List<Contribution> exceptedList= service.getContributionList();
        //then
        assertEquals(participantList, exceptedList);

    }

    @Test
    void should_return_participant_isRemoved() {
        //when
        when(repository.delete(any())).thenReturn(true);
        //then
        boolean isParticipantRemoved = service.delete(1L);
        //verify
        assertTrue(isParticipantRemoved);
    }

    @Test
    void should_return_addedParticipant() {
        //given
        Contribution participant = new Contribution(1L, "PTB_2", "http://localhost:8085/api/d-dcc/dcc/Temp_Comparison_PTB_1","reference");
        //when
        when(repository.addContribution(participant)).thenReturn(participant);
        //then
        Contribution participantExpected = service.addContribution(participant);
        assertNotNull(participantExpected);
        assertEquals(participant, participantExpected);
    }

//    @Test
//    void addReport() {
//        //given
//        Contribution participant1 = new Contribution(1L, "NPL", "CCM.M-K1-NPL9507");
//        Contribution participant2 = new Contribution(2L, "PTB", "CCM.M-K1-PTB9608");
//        participantList = List.of(participant1, participant2);
//        Report report = new Report("CCM-KC1", participantList);
//        //when
//        when(repository.addReport(report)).thenReturn(report);
//        //then
//        Report reportExpected = repository.addReport(report);
//        assertNotNull(reportExpected);
//        assertEquals(report, reportExpected);
//    }
}