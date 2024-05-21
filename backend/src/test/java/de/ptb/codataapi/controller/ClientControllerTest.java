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
 * LAST MODIFIED:		 14.01.24, 16:51
 */

package de.ptb.codataapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.ptb.codataapi.model.Participant;
import de.ptb.codataapi.service.ParticipantServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ClientControllerTest {
    @Mock
    private ParticipantServiceImpl service;
    @InjectMocks
    private ClientController controller;
    @Autowired
    private MockMvc mockMvc;
    private List<Participant> participantList;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        Participant participant1 = new Participant(1L, "NPL", "CCM.M-K1-NPL9507");
        Participant participant2 = new Participant(2L, "PTB", "CCM.M-K1-PTB9608");
        participantList = List.of(participant1, participant2);
    }

    @Test
    void getParticipants() throws Exception {
        when(service.getParticipantList()).thenReturn(participantList);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/client/participants")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
       verify(service).getParticipantList();
       verify(service,times(1)).getParticipantList();
    }

    @Test
    void addParticipant() throws Exception {
        Participant participant = new Participant(1L, "NPL", "CCM.M-K1-NPL9507");
        when(service.addParticipant(participant)).thenReturn(participant);
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/client/addParticipant")
                        .contentType(MediaType.APPLICATION_JSON).content(asJsonString(participant)))
                .andExpect(status().isCreated())
                .andDo(MockMvcResultHandlers.print());
        verify(service).addParticipant(participant);
        verify(service, times(1)).addParticipant(participant);
    }
    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}